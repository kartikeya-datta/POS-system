let role = sessionStorage.getItem('role')
    user = sessionStorage.getItem('email')
    token = sessionStorage.getItem('token')
    console.log(role)
if(role != 'admin' && !user && !token){
    window.location.href="login.html";
} else {
    console.log(user)
}
