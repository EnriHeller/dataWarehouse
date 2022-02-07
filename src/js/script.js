const inputCorreo = document.getElementById("correo")
const inputContrasena = document.getElementById("contrasena")
const ingresar = document.getElementById("ingresar")

const nombreNewUser = document.getElementById("nombreNewUser")
const apellidoNewUser = document.getElementById("apellidoNewUser")
const correoNewUser = document.getElementById("correoNewUser")
const contrasenaNewUser = document.getElementById("contrasenaNewUser")
const perfilNewUser = document.getElementById("perfilNewUser")
const newUser = document.getElementById("signInButton")



const login = function(){
    const valueCorreo = inputCorreo.value
    const valueContrasena = inputContrasena.value;

    console.log(`Correo: ${inputCorreo.value} Contraseña: ${inputContrasena.value}`)

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "posibleCorreo": valueCorreo,
    "posibleContrasena": valueContrasena
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("http://localhost:3000/logIn", requestOptions)
    .then(response => response.text())
    .then(result => localStorage.setItem("token", `Bearer ${result}`))
    .catch(error => console.log('error', error))
    }

const signIn = function(){
    const token = localStorage.getItem("token")
    var myHeaders = new Headers();
    myHeaders.append("Authorization", token.replace(/["']/g, ""));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "nombre": nombreNewUser.value,
    "apellido": apellidoNewUser.value,
    "correo": correoNewUser.value,
    "perfil": perfilNewUser.value,
    "contrasena": contrasenaNewUser.value
    });

    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };
  
    fetch("http://localhost:3000/signIn", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

ingresar.addEventListener("click", ()=>{
    login()
})

newUser.addEventListener("click",()=>{
    signIn()
})

