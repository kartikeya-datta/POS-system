document.addEventListener('DOMContentLoaded', async function () {
    const form = document.getElementById('addProduct')

    form.addEventListener('submit', async(e) => {
        e.preventDefault();
        console.log("Signup Form submitted");
        // Get form data
        const formData = new FormData(e.target);
        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
       console.log(formDataObject);
       const addProduct = await fetch('/admin/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObject)
        }).then((res) => res.json())
        console.log(addProduct);
        if(addProduct.success){
            alert("Product added successfully")
            window.location.reload(true)
        } else {
            console.log(addProduct)
            alert("Failed to add product")
        }
})
})