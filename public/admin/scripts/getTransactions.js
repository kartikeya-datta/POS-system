document.addEventListener('DOMContentLoaded', async function () {

    const getTransactions = await fetch('/admin/getTransactions', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        } 
    }).then((res) => res.json())
    console.log(getTransactions);
    if(getTransactions.list){
        //alert("Product added successfully")
        
        getTransactions.list.map((bill,index) => {
            displayProduct(bill);
        }) 

    } else {
        console.log(getTransactions)
        alert("Failed to get bill")
    }
})

function displayProduct(bill) {
    let dateObj =new Date(bill.billDate)
    const monthNames = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];
        const time = `${monthNames[dateObj.getUTCMonth()]}/${dateObj.getUTCDate()}/${dateObj.getUTCFullYear()} - ${dateObj.getUTCHours().toString().padStart(2, '0')}:${dateObj.getUTCMinutes().toString().padStart(2, '0')}`;
        if(bill.receipt.pdfURL){
        let createElement = `<tr>
        <td class="transactionId">${bill.transactionId}</td>
        <td class="time">${time}</td>
        <td class="name">${bill.fname} ${bill.lname}</td>
        <td class="email">${bill.email}</td>
        <td class="number">${bill.phoneNumber}</td>
        <td class="totalPrice">${bill.totalPrice}</td>
        <td class="transactionType">${bill.transactionType}</td>
        <td class="name">${bill.employeeName}</td>
        <td class="email">${bill.employeeMail}</td>
        <td style="text-align: center;">
        <a target="_blank" href="${bill.receipt.pdfURL}" download><button class="btn btn-primary edit-button">
                <i class="fa-solid fa-cloud-arrow-down fa-sm" style="color: #FFD43B;"></i>
            </button></a>
        </td>
    </tr>`;

    document.getElementById('data').innerHTML += createElement;
    } else {
        let createElement = `<tr>
        <td class="transactionId">${bill.transactionId}</td>
        <td class="time">${time}</td>
        <td class="name">${bill.fname} ${bill.lname}</td>
        <td class="email">${bill.email}</td>
        <td class="number">${bill.phoneNumber}</td>
        <td class="totalPrice">${bill.totalPrice}</td>
        <td class="transactionType">${bill.transactionType}</td>
        <td class="name">${bill.employeeName}</td>
        <td class="email">${bill.employeeMail}</td>
        <td style="text-align: center;">
        <a target="_blank" href="#" download><button class="btn btn-primary edit-button">
                <i class="fa-solid fa-cloud-arrow-down fa-sm" style="color: #D2042D;"></i>
            </button></a>
        </td>
    </tr>`;

    document.getElementById('data').innerHTML += createElement;
    }
}

