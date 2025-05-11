document.addEventListener('DOMContentLoaded', async function () {

    const inventoryList = await fetch('/employee/getProducts', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        } 
    }).then((res) => res.json())

    if (inventoryList.list) {
        console.log(inventoryList);
        const productTable = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
        inventoryList.list.forEach(inventoryList => {
            updateTable(inventoryList)
        })
        function updateTable(inventoryList) {
            const newRow = document.createElement('tr');
            if(inventoryList.stock > 0){
                newRow.innerHTML = `
                <td>${inventoryList.productId}</td>
                <td class="product">${inventoryList.name}</td>
                <td>${inventoryList.type}</td>
                <td contenteditable="false" class="quantity">${inventoryList.stock}</td>
                <td contenteditable="false">$ ${Number(inventoryList.productPrice).toFixed(2)}</td>
            `;
            } else {
                newRow.innerHTML = `
                <td>${inventoryList.productId}</td>
                <td class="product">${inventoryList.name}</td>
                <td>${inventoryList.type}</td>
                <td contenteditable="false" class="quantity" style="background-color: #DC4C60">${inventoryList.stock} ( Out of Stock )</td>
                <td contenteditable="false">$ ${Number(inventoryList.productPrice).toFixed(2)}</td>
            `;
            }
            
            productTable.appendChild(newRow);
        }

    }
});
