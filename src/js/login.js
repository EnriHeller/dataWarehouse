const inputCorreo = document.getElementById("inputCorreo")
const inputContrasena = document.getElementById("inputContrasena")
const ingresar = document.getElementById("loginButton")
const errorContainer = document.querySelector(".errorContainer")
const loginContainer = document.querySelector(".loginContainer__main")
const titleImg = document.querySelector(".titleImg")


const login = function(){
    const valueCorreo = inputCorreo.value
    const valueContrasena = inputContrasena.value;

    //console.log(`Correo: ${inputCorreo.value} Contraseña: ${inputContrasena.value}`)

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

    try {
        fetch("http://localhost:3000/logIn", requestOptions)
        .then((response) => {
            return response
        })
        .then((result) => {
            if(result.status == 200){
                loginContainer.classList.replace("opacityAnim","opacityInverseAnim")
                titleImg.classList.replace("opacityAnim","opacityInverseAnim")
                setTimeout(()=>{
                    result.json().then((token)=>{
                        localStorage.setItem("token", `Bearer ${token}`)
                        window.location.href = "/index.html"
                    })
                },300)
            }else{
                result.json().then((message)=>{
                    errorContainer.innerText = message
                })
                
            }
        })
    } catch (error) {
        console.log(error)
    }
    
    }

    ingresar.addEventListener("click", ()=>{
        login()
    })
    document.addEventListener("keyup",(event)=>{
        if(event.key == 'Enter'){
            login()
            loginContainer.style.width = "30%"

        }
    })

