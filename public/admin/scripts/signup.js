
const form = document.getElementById('signupForm')

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
   const response = await fetch('/admin/signup', {
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
        alert('Signup Successful')
        window.location.href='login.html'
    } else {
        console.log(response.errorMessage)
        alert(response.errorMessage)
    }
})