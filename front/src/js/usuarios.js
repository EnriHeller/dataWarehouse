const tablaUsuarios = document.getElementById('tablaUsuarios')
const popUpBkg = document.querySelector(".popUpBkg")
const newUserButton = document.getElementById("newUserButton")
const confirmUserButton = document.getElementById("confirmUserButton")
const editUserButton = document.getElementById("editUserButton")

const deleteButton = document.getElementById("deleteButton")

const errorContainer = document.querySelector(".errorContainer")
const validationsContainer = document.querySelectorAll(".validationContainer")
const messageContainer = document.querySelector(".messageContainer")

const backButtons = document.querySelectorAll(".backButton")

let idSelected;


function getUsuarios(){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem("token"));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    let status = false;
    fetch("http://localhost:3000/usuarios", requestOptions)
        .then((response) => {
            if(response.status == 200){
                status = true
            }
            return response

        })
        .then((result) => result.json().then((res)=>{
            if(status){
                popUpBkg.classList.add("opacityInverseAnim")
                document.getElementById("loadDiv").classList.add("opacityInverseAnim")
                setTimeout(()=>{
                    popUpBkg.style.display = "none"
                    popUpBkg.style.backgroundColor = "#0d093f75" //$popup-color
                    document.getElementById("loadDiv").style.display ="none"
                    printUsuarios(res)
                },300)
            }else{
                throw new Error(res.error)
            }
        }))
        .catch((error)=>{
            console.log(error.message)
            window.location.href = "/index.html"
        });
}

function printUsuarios(usersArray){
    if(usersArray.length !== 0){
        console.log(usersArray)
        usersArray.forEach(objetoUser =>{
            
            var id = objetoUser.id
            var nombre = objetoUser.nombre
            var apellido = objetoUser.apellido
            var correo = objetoUser.correo
            var esAdmin = objetoUser.esAdmin
            var perfil = objetoUser.perfil

            let userColumn = document.createElement("div")
            userColumn.classList.add("userColumn")
            userColumn.innerText = `${nombre} ${apellido}`

            let userEmailColumn = document.createElement("div")
            userEmailColumn.classList.add("userEmailColumn")
            userEmailColumn.innerText = correo


            let perfilColumn = document.createElement("div")
            perfilColumn.classList.add("perfilColumn")
            perfilColumn.innerText = perfil


            let adminColumn = document.createElement("div")
            adminColumn.classList.add("adminColumn")
                let adminImg = document.createElement("img")
                
                if(esAdmin){
                    adminImg.setAttribute("src", "/src/img/checkIcon.png")
                    adminImg.setAttribute("alt", "Si")
                }else{
                    adminImg.setAttribute("src", "/src/img/notIcon.png")
                    adminImg.setAttribute("alt", "No")
                }

            let actionsColumn = document.createElement("div")
            actionsColumn.classList.add("actionsColumn")
                    let editButton = document.createElement("a")
                    editButton.classList.add("editButton")
                        let editImage = document.createElement("img")
                        editImage.classList.add("editImage")
                        editImage.setAttribute("src","./src/img/editIcon.png" )
                        editImage.setAttribute("alt","edit")

                        editButton.addEventListener("pointerdown", ()=>{
                            idSelected = id
                            printUserValues(idSelected)

                            if(popUpBkg.classList.contains("opacityInverseAnim")){
                                popUpBkg.classList.replace("opacityInverseAnim","opacityAnim")
                            }else{
                                popUpBkg.classList.add("opacityAnim")
                            }
                            popUpBkg.style.display = "flex"
                            editValidation.style.display = "flex"
                            
                        })

                    
                    let deleteButton = document.createElement("a")
                    deleteButton.classList.add("deleteButton")
                        let deleteImage = document.createElement("img")
                        deleteImage.classList.add("deleteImage")

                        deleteImage.setAttribute("src","./src/img/deleteIcon.png" )
                        deleteImage.setAttribute("alt","delete")

                        deleteButton.addEventListener("click", ()=>{
                            if(popUpBkg.classList.contains("opacityInverseAnim")){
                                popUpBkg.classList.replace("opacityInverseAnim","opacityAnim")
                            }else{
                                popUpBkg.classList.add("opacityAnim")
                            }
                            
                            popUpBkg.style.display = "flex"
                            deleteValidation.style.display = "flex"
                            deleteMessage.innerText = 
                            `¿Desea eliminar a ${nombre} ${apellido} de la lista de usuarios?`
                            idSelected = id
                        })
                    

            tablaUsuarios.appendChild(userColumn)
            tablaUsuarios.appendChild(userEmailColumn)
            tablaUsuarios.appendChild(perfilColumn)
            tablaUsuarios.appendChild(adminColumn)
                adminColumn.appendChild(adminImg)
            tablaUsuarios.appendChild(actionsColumn)
                actionsColumn.appendChild(editButton)
                editButton.appendChild(editImage)

                actionsColumn.appendChild(deleteButton)
                deleteButton.appendChild(deleteImage)
        })
        
    }
}

function newUserWindow(){
    if(popUpBkg.classList.contains("opacityInverseAnim")){
        popUpBkg.classList.replace("opacityInverseAnim","opacityAnim")
    }else{
        popUpBkg.classList.add("opacityAnim")
    }
    setTimeout(()=>{
        popUpBkg.style.display = "flex"
        postValidation.style.display = "flex"
    }, 300)
}

getUsuarios()
newUserButton.addEventListener("click", ()=>{
    newUserWindow()
})

confirmUserButton.addEventListener("pointerdown", ()=>{
    postNewUser()
})

function postNewUser(){
    const contrasena = document.getElementById("userPassword").value
    const contrasenaRepeat = document.getElementById("repeatPassword").value

    try {
        if(contrasena == contrasenaRepeat){
            const newUser = {
                nombre: document.getElementById("nombre").value,
                apellido: document.getElementById("apellido").value,
                correo: document.getElementById("correo").value,
                esAdmin: document.getElementById("checkAdmin").checked,
                perfil: document.getElementById("inputPerfil").value,
                contrasena: contrasena
            } 
            var myHeaders = new Headers();
            myHeaders.append("Authorization", localStorage.getItem("token")
            )
            myHeaders.append("Content-Type", "application/json");
            
            var raw = JSON.stringify(newUser);
            
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
            
            fetch("http://localhost:3000/signIn", requestOptions)
            .then((response) => {return response})
            .then((result) => {
                if(result.status == 200){
                    errorContainer.innerText = ""

                    result.json().then((res)=>{
                        popUpBkg.classList.replace("opacityAnim","opacityInverseAnim")
                        setTimeout(()=>{
                            popUpBkg.style.display = "none"
                            validationsContainer.forEach(container=>{
                            container.style.display = "none"
                            })
                            messageContainer.innerText = res
                            messageContainer.classList.replace("opacityInverseAnim", "opacityAnim")
                            setTimeout(()=>{
                                messageContainer.classList.replace("opacityAnim", "opacityInverseAnim")
                                setTimeout(()=>{
                                    messageContainer.innerText = ""
                                },300)
                            },2000)
                            updateUserTable()
                        }, 300)
                    })
                }else{
                    result.json().then((res)=>{
                        errorContainer.innerText = res
                        console.log(res)
                    })
                }
            })
            .catch(error => console.log('error', error));
        }else{
            throw new Error("Las contraseñas no coinciden, intente nuevamente")
        }
    } catch (error) {
        errorContainer.innerText = error.message
    }
}

function updateUserTable(){
    tablaUsuarios.innerHTML = `
    <div class="columnTitle">Usuario</div>
            <div class="columnTitle">Correo</div>
            <div class="columnTitle">Perfil</div>
            <div class="columnTitle">Admin</div>
            <div class="columnTitle">Acciones</div>`
    getUsuarios()
}

backButtons.forEach(button =>{
    button.addEventListener("pointerdown", ()=>{
        popUpBkg.classList.replace("opacityAnim","opacityInverseAnim")
        setTimeout(()=>{
        popUpBkg.style.display = "none"
        validationsContainer.forEach(container=>{
            container.style.display = "none"
        })
        }, 300)
    })
})

function printUserValues(id){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem("token"));

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch(`http://localhost:3000/usuarios/${id}`, requestOptions)
    .then((response) => {return response})
    .then((result) => result.json().then((res)=>{
        document.getElementById("nombreEdit").value = res.nombre
        document.getElementById("apellidoEdit").value = res.apellido
        document.getElementById("correoEdit").value = res.correo
        document.getElementById("checkAdminEdit").checked = res.esAdmin
        document.getElementById("inputPerfilEdit").value = res.perfil
    }
    ))
    .catch(error => console.log('error', error));
}

function deleteUsuario(id){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem("token"));

    var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
    };
    fetch(`http://localhost:3000/usuarios/${id}`, requestOptions)
    .then((response) => {return response})
    .then((result) => result.json().then((res)=>{
        messageContainer.innerText = res
        messageContainer.classList.replace("opacityInverseAnim", "opacityAnim")
        setTimeout(()=>{
            messageContainer.classList.replace("opacityAnim", "opacityInverseAnim")
            setTimeout(()=>{

                messageContainer.innerText = ""
            },300)
        },2000)
        updateUserTable()
    }))
    .catch(error => console.log('error', error));
}

editUserButton.addEventListener("click", ()=>{

    try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");
        
        let userModify;
        let newPassword = document.getElementById("userPasswordEdit").value
        let repeatPassword = document.getElementById("repeatPasswordEdit").value
        if(newPassword !== ""){
            if(newPassword == repeatPassword){
                userModify = {
                    nombre: document.getElementById("nombreEdit").value,
                    apellido: document.getElementById("apellidoEdit").value,
                    correo: document.getElementById("correoEdit").value,
                    esAdmin: document.getElementById("checkAdminEdit").checked,
                    perfil: document.getElementById("inputPerfilEdit").value,
                    contrasena: newPassword
                }
            }else{
                throw new Error("Las contraseñas no coinciden, intente nuevamente")
            }
        }else{
            userModify = {
                nombre: document.getElementById("nombreEdit").value,
                apellido: document.getElementById("apellidoEdit").value,
                correo: document.getElementById("correoEdit").value,
                esAdmin: document.getElementById("checkAdminEdit").checked,
                perfil: document.getElementById("inputPerfilEdit").value,
            }
        }
            
            console.log(userModify)
            var raw = JSON.stringify(userModify);

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(`http://localhost:3000/usuarios/${idSelected}`, requestOptions)
            .then((response) => {return response})
            .then((result) => {
                if(result.status == 200){
                    errorContainer.innerText = ""

                    result.json().then((res)=>{
                        popUpBkg.classList.replace("opacityAnim","opacityInverseAnim")
                        setTimeout(()=>{
                            popUpBkg.style.display = "none"
                            validationsContainer.forEach(container=>{
                            container.style.display = "none"
                            })
                            messageContainer.innerText = res
                            messageContainer.classList.replace("opacityInverseAnim", "opacityAnim")
                            setTimeout(()=>{
                                messageContainer.classList.replace("opacityAnim", "opacityInverseAnim")
                                setTimeout(()=>{
                                    messageContainer.innerText = ""
                                },300)
                            },2000)
                            updateUserTable()
                        }, 300)
                    })
                }else{
                    result.json().then((res)=>{
                        errorContainer.innerText = res
                        console.log(res)
                    })
                }
            })
            .catch(error => console.log('error', error));
        
    } catch (error) {
        console.log(error.message)
    }
    
})

deleteButton.addEventListener("pointerdown",()=>{
    deleteUsuario(idSelected)
    popUpBkg.classList.add("opacityInverseAnim")
    setTimeout(()=>{
        popUpBkg.style.display = "none"
        deleteValidation.style.display = "none"
    }, 300)
})

