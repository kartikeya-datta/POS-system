const form = document.getElementById('loginForm')

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
   const response = await fetch('/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObject)
    }).then((res) => res.json())
    console.log(response);
    if(response.user){
        sessionStorage.setItem('token',response.token)
        sessionStorage.setItem('role',"admin")
        sessionStorage.setItem('email',response.user.email)
        sessionStorage.setItem('name', response.user.firstname)
        alert("Login successful")
        window.location.href='index.html'
    } else {
        if(response.error){
            console.log(response.error)
            alert(response.error)
        } else {
            console.log(response.errorMessage)
            alert(response.errorMessage)
        }
    }
})