let role = sessionStorage.getItem('role')
    user = sessionStorage.getItem('email')
    token = sessionStorage.getItem('token')
    console.log(role)
if(role != 'user' && !user && !token){
    window.location.href="employeeLogin.html";
} else {
    console.log(user)
}
