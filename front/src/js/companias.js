const tablaCompanias = document.getElementById('tablaCompanias')
const popUpBkg = document.querySelector(".popUpBkg")
const newCompanyButton = document.getElementById("newCompanyButton")

const selectRegiones = document.getElementById("selectRegiones")
const selectPaises = document.getElementById("selectPaises")
const selectCiudades = document.getElementById("selectCiudades")
const confirmCompanyButton = document.getElementById("confirmCompanyButton")

const editCompanyButton = document.getElementById("editCompanyButton")

const deleteButton = document.getElementById("deleteButton")

const errorContainer = document.querySelector(".errorContainer")
const validationsContainer = document.querySelectorAll(".validationContainer")
const messageContainer = document.querySelector(".messageContainer")

const backButtons = document.querySelectorAll(".backButton")

let idSelected;


function getCompanias(){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem("token"));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/companias", requestOptions)
        .then((response) => {return response})
        .then((result) => result.json().then((res)=>{
            if(!res[res.length-1].av){
                document.getElementById("usersButton").style.display = "none"
            }
            popUpBkg.classList.add("opacityInverseAnim")
            setTimeout(()=>{
                popUpBkg.style.display = "none"
                popUpBkg.style.backgroundColor = "#0d093f75" //$popup-color
                printCompanias(res)
            },300)
        }))
        .catch((error)=>{
            window.location.href = "/login.html"
            localStorage.clear()
        });
}

function printCompanias(companiesArray){
    if(companiesArray.length !== 0){
    
        companiesArray.forEach(objetoUser =>{
            if(objetoUser.nombre){
                var id = objetoUser.id
                var nombre = objetoUser.nombre
                var pais = objetoUser.paise.nombre
                var region = objetoUser.regione.nombre
                var correo = objetoUser.correo
                var telefono = objetoUser.telefono  

                let companyNameColumn = document.createElement("div")
                companyNameColumn.classList.add("companyNameColumn")
                companyNameColumn.innerText = nombre

                let countryColumn = document.createElement("div")
                countryColumn.classList.add("textColumn")

                    let countryName = document.createElement("p")
                    countryName.innerText = pais

                    let countryRegion = document.createElement("p")
                    countryRegion.classList.add("subtitle")
                    countryRegion.innerText = region

                
                let companyEmailColumn = document.createElement("div")
                companyEmailColumn.classList.add("companyEmailColumn")
                companyEmailColumn.innerText = correo

                let companyTelColumn = document.createElement("div")
                companyTelColumn.classList.add("companyTelColumn")
                companyTelColumn.innerText = telefono



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
                                //printCompanyValues(idSelected)

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
                        

                tablaCompanias.appendChild(companyNameColumn)
                tablaCompanias.appendChild(countryColumn)
                            countryColumn.appendChild(countryName)
                            countryColumn.appendChild(countryRegion)
                tablaCompanias.appendChild(companyEmailColumn)
                tablaCompanias.appendChild(companyTelColumn)
                tablaCompanias.appendChild(actionsColumn)
                    actionsColumn.appendChild(editButton)
                    editButton.appendChild(editImage)

                    actionsColumn.appendChild(deleteButton)
                    deleteButton.appendChild(deleteImage)
            }
            
        })
        
    }
}

function newCompanyWindow(){
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

getCompanias()
newCompanyButton.addEventListener("click", ()=>{

    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem("token"));

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };


    fetch("http://localhost:3000/regiones", requestOptions)
        .then((response) => {return response})
        .then((result) => result.json().then((res)=>{
            printRegiones(res)}))
        .catch(error => console.log('error', error));
    newCompanyWindow()
})

confirmCompanyButton.addEventListener("pointerdown", ()=>{
    postNewCompany()
})

function postNewCompany(){

    try {
        const newCompany = {
            nombre: document.getElementById("nombre").value,
            direccion: document.getElementById("direccion").value,
            correo: document.getElementById("correo").value,
            telefono: document.getElementById("inputTelefono").value,
            regiones_id: document.getElementById("selectRegiones").value,
            paises_id: document.getElementById("selectPaises").value,
            ciudades_id: document.getElementById("selectCiudades").value,
        } 
        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem("token")
        )
        myHeaders.append("Content-Type", "application/json");
        
        console.log(newCompany)
        var raw = JSON.stringify(newCompany);
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        
        fetch("http://localhost:3000/companias", requestOptions)
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
                        updateCompaniasTable()
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
        errorContainer.innerText = error.message
        console.log(error.message)
    }
}

function updateCompaniasTable(){
    tablaCompanias.innerHTML = `
        <div class="columnTitle">Nombre</div>
        <div class="columnTitle">Pais/Región</div>
        <div class="columnTitle">Correo</div>
        <div class="columnTitle">Teléfono</div>
        <div class="columnTitle">Acciones</div>`
    getCompanias()
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

function printCompanyValues(id){
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

editCompanyButton.addEventListener("click", ()=>{

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

function printRegiones(regiones){
    selectRegiones.innerHTML = `<option id="region" selected disabled>Seleccionar región</option>`
    regiones.forEach(region =>{
        if(region.nombre){
            let posibleRegion = document.createElement("option")
            posibleRegion.value = region.id
            posibleRegion.text = region.nombre
            selectRegiones.appendChild(posibleRegion)
        }
    })
} 

function printPaises(){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem('token'));

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch(`http://localhost:3000/paises/${selectRegiones.value}`, requestOptions)
    .then((response) => {return response})
        .then((result) => result.json().then((paises)=>{
            selectPaises.innerHTML = `<option selected disabled>Seleccionar país</option>`
            paises.forEach(pais =>{
                let posiblePais = document.createElement("option")
                posiblePais.value = pais.id
                posiblePais.text = pais.nombre
                selectPaises.appendChild(posiblePais)
            })
        }))
        .catch(error => console.log('error', error));
}

function printCiudades(){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem('token'));

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch(`http://localhost:3000/ciudades/${selectPaises.value}`, requestOptions)
    .then((response) => {return response})
        .then((result) => result.json().then((ciudades)=>{
            selectCiudades.innerHTML = `<option selected disabled>Seleccionar ciudad</option>`
            ciudades.forEach(ciudad =>{
                let posibleCiudad = document.createElement("option")
                posibleCiudad.value = ciudad.id
                posibleCiudad.text = ciudad.nombre
                selectCiudades.appendChild(posibleCiudad)
            })
        }))
        .catch(error => console.log('error', error));
}
