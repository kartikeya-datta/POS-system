document.addEventListener('DOMContentLoaded', async function () {
    const form = document.getElementById('billingForm');
    form.addEventListener('submit', async (e) => {
        console.log("form received");
        e.preventDefault();
        // Get form data
        const formData = new FormData(e.target);
        const formDataObject = {};
        ;
       // console.log(formDataObject);
       // Extract product data from the product table
        const productRows = document.querySelectorAll('#productTable tbody tr');
        const products = [];
        var totalQuantity = 0;
        productRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 6) {
                const product = {
                    productId: cells[0].textContent,
                    name: cells[1].textContent,
                    type: cells[2].textContent,
                    quantity: cells[3].textContent,
                    productPrice: cells[4].textContent
                };
                products.push(product);
                totalQuantity = Number(totalQuantity) + Number(cells[3].textContent)
            }
        });
        let paymentMode = document.getElementsByName('dbt')[0].checked ? 'Cash' : 'Card'
        // Prepare data to send to the backend
        formData.append('products', JSON.stringify(products));
        formData.append('totalPrice', document.querySelector('.totalPrice').textContent);
        formData.append('employeeName', sessionStorage.getItem('name'));
        formData.append('employeeMail', sessionStorage.getItem('email'));
        formData.append('totalQuantity', totalQuantity);
        formData.append('transactionType', paymentMode)
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        })

        console.log(formDataObject)

        const bill = await fetch('/employee/generateBill', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObject)
        }).then((res) => res.json())
        console.log(bill);
        if(bill.transaction){
            console.log("Bill generated")
            let dateObj =new Date(bill.transaction.billDate)
            const monthNames = [
                "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
                ];
                const time = `${monthNames[dateObj.getUTCMonth()]}/${dateObj.getUTCDate()}/${dateObj.getUTCFullYear()} - ${dateObj.getUTCHours().toString().padStart(2, '0')}:${dateObj.getUTCMinutes().toString().padStart(2, '0')}`;
              
        // Construct HTML content for the receipt
        let receiptContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Transaction Receipt</title>
            <style>
            body {
                font-size: small;
                line-height: 1.5;
            }
    
            p {
                margin: 0;
            }
    
            .performance-facts {
                border: 1px solid black;
                margin: 20px;
                float: left;
                width: 400px;
                padding: 0.5rem;
            }
    
            .performance-facts table {
                border-collapse: collapse;
            }
    
            .performance-facts__title {
                font-weight: bold;
                font-size: 2rem;
                margin: 0 0 0.25rem 0;
            }
    
            .performance-facts__header {
                border-bottom: 10px solid black;
                padding: 0 0 0.25rem 0;
                margin: 0 0 0.5rem 0;
            }
    
            .performance-facts__header p {
                margin: 0;
            }
    
            .performance-facts__table {
                width: 100%;
            }
    
            .performance-facts__table thead tr th,
            .performance-facts__table thead tr td {
                border: 0;
            }
    
            .performance-facts__table th,
            .performance-facts__table td {
                font-weight: normal;
                text-align: left;
                padding: 0.25rem 0;
                border-top: 1px solid black;
                white-space: nowrap;
            }
    
            .performance-facts__table td:last-child {
                text-align: left;
            }
    
            .performance-facts__table .blank-cell {
                width: 1rem;
                border-top: 0;
            }
    
            .performance-facts__table .thick-row th,
            .performance-facts__table .thick-row td {
                border-top-width: 5px;
            }
    
            .small-info {
                font-size: 0.7rem;
            }
    
            .performance-facts__table--small {
                border-bottom: 1px solid #999;
                margin: 0 0 0.5rem 0;
            }
    
            .performance-facts__table--small thead tr {
                border-bottom: 1px solid black;
            }
    
            .performance-facts__table--small td:last-child {
                text-align: left;
            }
    
            .performance-facts__table--small th,
            .performance-facts__table--small td {
                border: 0;
                padding: 0;
            }
    
            .performance-facts__table--grid {
                margin: 0 0 0.5rem 0;
            }
    
            .performance-facts__table--grid td:last-child {
                text-align: left;
            }
    
            .performance-facts__table--grid td:last-child::before {
                content: "•";
                font-weight: bold;
                margin: 0 0.25rem 0 0;
            }
    
            .text-center {
                text-align: center;
            }
    
            .thick-end {
                border-bottom: 10px solid black;
            }
    
            .thin-end {
                border-bottom: 1px solid black;
            }
            td,th{
                font-weight: bold !important;
            }
            tr>td:nth-child(2){
                text-align: left !important;
                color: #000 !important;
            }
            </style>
        </head>
        <body>
            <section class="performance-facts">
                <header class="performance-facts__header">
                    <h2 class="performance-facts__title">Transaction Receipt</h2>
                </header>
                <div>
                    <h6>Transaction Id : <b>${bill.transaction.transactionId}</b><h6>
                    <h6>Bill date : <span style="font-size: 14px !important">${time}</span></h6>
                    <h6>Customer Details:</h6>
                    <p>First Name: <b>${formDataObject.fname}</b></p>
                    <p>Last Name: <b>${formDataObject.lname}</b></p>
                    <p>Phone: <b>${formDataObject.phoneNumber}</b></p>
                    <p>Email: <b>${formDataObject.email}</b></p>
                </div>
                <div class="thick-end">
                    <h6>Product Details:</h6>
                    
                    <table class="performance-facts__table">
                        <thead>
                        <th colspan="2">Product Name</th>
                        <th> QTY </th>
                        <th> Price</th>
                        <th> Total </th>
                        </thead>
                    <tbody>`;
    const productsArray = JSON.parse(formDataObject.products);
    let i = 1
    productsArray.forEach(product => {
        // Start building the table
       // console.log(Number(product.productPrice) / 1.00)
       let price = Number(product.productPrice) * Number(product.quantity)
       console.log(product.productPrice , product.quantity)
    receiptContent += `
            <tr>
                <td colspan="2">${i++}. ${product.name}</td>
                <td>${product.quantity} Qty</td>
                <td>${Number(product.productPrice).toFixed(2)}</td>
                <td>$${ Number(price).toFixed(2)}</td>
            </tr>
        `;

    });

    let taxes = document.getElementById('taxes').textContent
    receiptContent += `
                        </tbody>
                    </table>
                </div>
                <script>
                    const totalPrice = formDataObject.totalPrice; // Get the total price from your formDataObject
                    const totalPriceWithTax = totalPrice + totalPrice * ${taxes}; // Calculate total price with 5% tax
                </script>
                <div class="thin-end">
                    <h6> Price : <p style="font-size: 22px; font-weight: bolder; display: inline-block !important;"> <b>${formDataObject.totalPrice}</b></p></h6>
                    <h6> Taxes : <p style="font-size: 22px; font-weight: bolder; display: inline-block !important;"> <b>${taxes} %</b></p></h6>
                    <h6>Total Price :   <p style="font-size: 22px; font-weight: bolder; display: inline-block !important;"><b>$ ${Number(parseFloat(formDataObject.totalPrice.replace('$', '')) * parseFloat((taxes/100)+1)).toFixed(2)} /-</b></p></h6>
                </div>
                <div class="thin-end">
                    <h6 >Payment Mode : ${bill.transaction.transactionType}<p style="font-weight: 800; display: inline-block !important;" id="stamp"> <img src="./stamp.png" alt="Paid Stamp" style="position: relative; display: inline-block !important;" height="50px"  width="80px"></p> </h6>
                </div>
                <div style="margin-top: 10px">
                    <p>Employee name : <b>${bill.transaction.employeeName}</b></p>
                    <p>Employee Mail : <b>${bill.transaction.employeeMail}</b></p>
                </div>
            </section>
        </body>
        </html>`;

        let finalPrice = document.getElementById('finalPrice');
        finalPrice.textContent(`${Number(parseFloat(formDataObject.totalPrice.replace('$', '')) * parseFloat((taxes/100)+1)).toFixed(2)}`)



    // Open a new window and write the receipt content
   // const receiptWindow = window.open('', '_blank');
   // receiptWindow.document.write(receiptContent);

        const generatePDF = async() => {
           
            // Create a div element to hold the receipt content
            const element = document.createElement('div');
            element.innerHTML = receiptContent;
            console.log(element)
            
            // Wait for a short delay to ensure the image is appended before generating the PDF
            await new Promise(resolve => setTimeout(resolve, 100));
            // Set options with fixed page size
            const options = {
                filename: `${formDataObject.fname}-receipt.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            // Generate the PDF
            await html2pdf().from(element).set(options).save();
           /*
            const forms = new FormData()
            forms.append('pdf', pdf)
            console.log(forms)
            const result = await axios.post('/employee/uploadReceipt', forms, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
          });
            console.log(result); */
            document.getElementById('customFileInput').addEventListener('change', async function() {
                const selectedFile = this.files[0];
                console.log('Selected file:', selectedFile);
                const forms = new FormData()
                forms.append('pdf', selectedFile)
                forms.append('name',bill.transaction.fname)
                forms.append('mail',bill.transaction.email)
                forms.append('id', bill.transaction._id)
                console.log(forms)
                const result = await axios.post('/employee/uploadReceipt', forms, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
              });
                console.log(result); 
                if(result.data){
                    alert("Bill saved in cloud")
                    window.location.reload(true)
                } else {
                    alert("Failed to save bill in cloud")
                }
            });
            const pdf = await html2pdf().from(element).set(options).output('blob');
            const downloadedFile = new File([pdf], options.filename, { type: 'application/pdf' });
            const fileInput = document.getElementById('customFileInput');
            const fileList = new DataTransfer();
            fileList.items.add(downloadedFile);
            fileInput.files = fileList.files;
            fileInput.dispatchEvent(new Event('change'));
        
        };




    // Call the function to generate PDF
    generatePDF();
    


    } else {
        alert("Bill not generated")
        if(bill.error){
            console.log(bill.error)
        } else {
            console.log(bill)
        }
    }

})
    const submitButton = document.getElementById('submit-button');
    submitButton.addEventListener('click', function(event) {
        document.getElementById('hidden-submit-button').click()
    });
})

  