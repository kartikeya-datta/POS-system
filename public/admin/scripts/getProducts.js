document.addEventListener('DOMContentLoaded', async function () {

    const getProduct = await fetch('/admin/getProducts', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        } 
    }).then((res) => res.json())
    console.log(getProduct);
    if(getProduct.list){
        //alert("Product added successfully")
        
        getProduct.list.map((product,index) => {
            displayProduct(product);
        })

        const editButtons = document.querySelectorAll('.edit-button');
        const deleteButtons = document.querySelectorAll('.delete-button');
        const toggleContentEditable = (element) => element.contentEditable = !element.isContentEditable;
  
        //console.log(selectOptions)
        editButtons.forEach(editButton => {
            editButton.addEventListener('click', async () => {
                const row = editButton.closest('tr');
                const elements = ['.productId', '.name', '.type', '.productPrice', '.stock', '.units'].map(selector => row.querySelector(selector));
                const id = editButton.dataset.id;
                const previousQuantity = row.querySelector(".stock").dataset.previousquantity;
                //console.log(row.querySelector(".quantity").dataset)
                elements.forEach(toggleContentEditable);
                editButton.innerHTML = elements[1].isContentEditable ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-pen-to-square"></i>';
                if (!elements[1].isContentEditable) {
                    const updatedData = Object.fromEntries(elements.map(el => [el.className, el.textContent.trim()]));
                    updatedData.id = id;
                    Number(previousQuantity) - Number(updatedData.stock) == 0 ? 0 : updatedData.previousQuantity = previousQuantity
                    console.log(Number(previousQuantity) - Number(updatedData.stock) === 0)
                    console.log('Updated Data:', updatedData);
                    const editData = await fetch('/admin/editProduct', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedData),
                    })
                    .then((res) => res.json());
                    console.log(editData);
                    if(editData.success){
                        console.log(editData.success);
                        alert("Product data edited successfully")
                        window.location.reload();
                    } else {
                        alert("Failed to edit products")
                    } 
                }
            });
        });
         
        deleteButtons.forEach(deleteButton => {
            deleteButton.addEventListener('click', async() => {
                const row = deleteButton.closest('tr');
                const id = row.querySelector('.edit-button').dataset.id

                const updatedData = {
                    id: id
                };
                console.log('Delete Data:', updatedData);
                const editData = await fetch('/admin/deleteProduct', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                })
                .then((res) => res.json());
                console.log(editData);
                if(editData.success){
                    console.log(editData.success);
                    alert("Product deleted successfully")
                    window.location.reload();
                } else {
                    alert("Failed to delete product")
                } 
            });
        });

    } else {
        console.log(getProduct)
        alert("Failed to get product")
    }
})

function displayProduct(product) {

    let createElement = `<tr>
        <td class="productId">${product.productId}</td>
        <td class="type">${product.type}</td>
        <td class="name">${product.name}</td>
        <td class="stock" data-previousQuantity=${product.stock}>${product.stock}</td>
        <td class="units">${product.units}</td>
        <td class="productPrice">${product.productPrice}</td>
        <td>
            <button data-id=${product._id} class="btn btn-primary edit-button">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn btn-danger delete-button">
                <i class="fa-sharp fa-solid fa-trash"></i>
            </button>
        </td>
    </tr>`;

    document.getElementById('data').innerHTML += createElement;
}

