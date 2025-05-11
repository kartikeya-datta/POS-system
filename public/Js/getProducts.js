document.addEventListener('DOMContentLoaded', async function () {

    const productList = await fetch('/employee/getProducts', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        } 
    }).then((res) => res.json())

    if (productList.list) {
        console.log(productList);
        const productInput = document.getElementById('productInput');
        const productListDatalist = document.getElementById('productList');
        const updateButton = document.getElementById('updateButton');
        const productTable = document.getElementById('productTable').getElementsByTagName('tbody')[0];
        const yourOrderTable = document.getElementById('yourOrderTable');

        function updateTable(selectedProduct) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${selectedProduct.productId}</td>
                <td class="product" style="text-align: center !important; font-weight: bold;">${selectedProduct.name} ${selectedProduct.units}</td>
                <td>${selectedProduct.type}</td>
                <td contenteditable="true" class="quantity" data-max=${selectedProduct.stock}>1</td>
                <td contenteditable="false">${selectedProduct.productPrice}</td>
                <td ><i class="fa-sharp delete fa-solid fa-trash"></i></td>
            `;
            productTable.appendChild(newRow);
            const quantityFields = document.querySelectorAll('.quantity');
            quantityFields.forEach(field => {
                field.addEventListener('input',  function(e) {
                    updateYourOrderTable();
                    const quantityField = e.target;
                   // const row = field.closest('tr')
                    const enteredValue = parseInt(quantityField.textContent.trim(), 10);
                    const maxQuantity =  quantityField.dataset.max
                    //console.log(maxQuantity)
                    if (enteredValue > maxQuantity) {
                        alert('Out of stock');
                        quantityField.textContent = '1';
                        updateYourOrderTable();
                    }
                });
            });
            updateYourOrderTable();
            const deleteButtons = document.querySelectorAll('.delete');
            // Remove previously assigned event listeners before assigning new ones
            deleteButtons.forEach(btn => {
                btn.removeEventListener('click', deleteHandler);
            });

            // Delegated event listener for delete buttons
            productTable.addEventListener('click', deleteHandler);
        }

        function deleteHandler(event) {
            if (event.target.classList.contains('delete')) {
                const btn = event.target;
                const row = btn.closest('tr');
                const product = row.querySelector('.product').textContent;
                row.remove();
                updateYourOrderTable();
               // console.log(product);
                const option = document.createElement('option');
                option.value = product;
                productListDatalist.appendChild(option);
            }
        }

        productList.list.forEach(product => {
            if(product.stock != 0){
                const option = document.createElement('option');
                option.value = product.name+'_'+product.units;
               // option.textContent =product.name+'_'+product.units
                productListDatalist.appendChild(option);
            }
        });

        updateButton.addEventListener('click', function () {
            const selectedProductName = productInput.value.split('_')[0];
            const selectedUnits = productInput.value.split('_')[1];
            const selectedProductIndex = productList.list.findIndex(product => {
                return product.name === selectedProductName && product.units == selectedUnits;
            });
            console.log(selectedProductIndex)
            if (selectedProductIndex !== -1) {
                const selectedProduct = productList.list[selectedProductIndex];
                updateTable(selectedProduct);
                //console.log(productInput.value)
                //console.log(productListDatalist)
                const selectedOption = productListDatalist.querySelector(`option[value="${productInput.value}"]`);
                //console.log(selectedOption)
                if (selectedOption) {
                    selectedOption.remove();
                 // console.log("removed")
                }
            } else {
                alert('Please select a valid product from the list.');
            }
            productInput.value = '';
        });

        function updateYourOrderTable() {
            let taxes = document.getElementById('taxes').textContent
            console.log(taxes)
            yourOrderTable.innerHTML = '';
            const rows = productTable.getElementsByTagName('tr');
            let totalPrice = 0;
           
            for (let i = 0; i < rows.length; i++) {
                const cells = rows[i].getElementsByTagName('td');
                if (cells.length === 6) {
                    const name = cells[1].textContent;
                    const quantity = parseInt(cells[3].textContent);
                    const price = parseFloat(cells[4].textContent);
                    if (!isNaN(quantity) && !isNaN(price)) {
                        const row = document.createElement('tr');
                        const productNameCell = document.createElement('td');
                        const priceCell = document.createElement('td');
                        productNameCell.textContent = `${name} - ${quantity} (Qty)`;
                        productNameCell.className = 'productName';
                        priceCell.textContent = `$${(quantity * price).toFixed(2)}`;
                        priceCell.className = 'price';
                        row.appendChild(productNameCell);
                        row.appendChild(priceCell);
                        yourOrderTable.appendChild(row);
                        totalPrice += quantity * price;
                    }
                }
            }

            const totalRow = document.createElement('tr');
            const totalLabelCell = document.createElement('td');
            const totalPriceCell = document.createElement('td');
            totalLabelCell.textContent = 'Sub Total';
            totalPriceCell.textContent = `$${totalPrice.toFixed(2)}`;
            totalPriceCell.className = 'totalPrice';
            totalRow.appendChild(totalLabelCell);
            totalRow.appendChild(totalPriceCell);
            const taxesRow = document.createElement('tr');
            const taxesLabelCell = document.createElement('td');
            const taxesPriceCell = document.createElement('td');
            taxesLabelCell.textContent = 'Sales Taxes';
            taxesPriceCell.textContent = `${Number(taxes)}`;
            taxesPriceCell.contentEditable = "true"
            taxesPriceCell.className = 'taxes';
            taxesPriceCell.id='taxes'
            taxesRow.appendChild(taxesLabelCell);
            taxesRow.appendChild(taxesPriceCell);
            yourOrderTable.appendChild(totalRow);
            yourOrderTable.appendChild(taxesRow);
        }
    }
});
