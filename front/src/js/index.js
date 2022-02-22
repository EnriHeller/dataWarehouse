const tablaContactos = document.getElementById('tablaContactos')
let checkContactos = document.getElementById("checkContactos")
const newContactMain = document.querySelector("#newContact")
const messageContainer = document.querySelector(".messageContainer")

const searchInput = document.querySelector("#searchInput")
const searchButton = document.getElementById("searchButton")
const inputImagen = document.getElementById("inputImagen")

//validation containers
const popUpBkg = document.querySelector(".popUpBkg")
const deleteValidation = document.querySelector("#deleteValidation")
const deleteSelectionValidation = document.querySelector("#deleteSelectionValidation")
const postValidation = document.querySelector("#postValidation")
const editValidation = document.querySelector("#editValidation")

const deleteMessage = document.querySelector("#deleteMessage")
const deleteButton = document.querySelector("#deleteButton")
const deleteSelectionButton = document.getElementById("deleteSelectionButton")
const confirmSelectionButton = document.getElementById("confirmSelectionButton")
const backButtons = document.querySelectorAll(".backButton")
const validationsContainer = document.querySelectorAll(".validationContainer")
let idSelected;

//IMPRIMIR TODOS LOS CONTACTOS

getContactos()

function getContactos(){
        var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem("token"));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/contactos", requestOptions)
        .then((response) => {return response})
        .then((result) => result.json().then((res)=>{
            if(!res[res.length-1].av){
                document.getElementById("usersButton").style.display = "none"
            }

            popUpBkg.classList.add("opacityInverseAnim")
            setTimeout(()=>{
                popUpBkg.style.display = "none"
                popUpBkg.style.backgroundColor = "#0d093f75" //$popup-color
                printContactos(res)
            },300)
        }))
        .catch(()=>{
            window.location.href = "/login.html"
        });
}

function printContactos(arrayContactos){
    if(arrayContactos.length !== 0){
        arrayContactos.forEach(objetoContacto=>{
            if(objetoContacto.nombre){
                var id = objetoContacto.id
            var nombre = objetoContacto.nombre
            var apellido = objetoContacto.apellido
            var imagen = objetoContacto.imagen
            if(imagen == "" || imagen == null || !imagen){
                imagen = "./src/img/defaultContactIcon.png"
            }
            var pais = objetoContacto.paise.nombre
            var region = objetoContacto.regione.nombre
            var compania = objetoContacto.compania.nombre
            var cargo = objetoContacto.cargo
            var canales = objetoContacto.canales
            var intereses = canales.map(canal =>{ return canal.contactos_has_canales.interes})
            var correo = objetoContacto.correo
            
            /* create divs */
            let checkColumn = document.createElement("div")
            checkColumn.classList.add("checkColumn")
                let checkbox = document.createElement("input")
                checkbox.setAttribute("type", "checkbox")
                checkbox.setAttribute("contactId", id)
                

            let contactColumn = document.createElement("div")
            contactColumn.classList.add("contactColumn")

                let contactImg = document.createElement("img")
                contactImg.setAttribute("src", imagen)
                contactImg.setAttribute("alt", 'imagen')
                contactImg.classList.add("contactImg")

                let contactData = document.createElement("div")
                contactData.classList.add("contactData")

                    let contactName = document.createElement("p")
                    contactName.classList.add("contactName")
                    contactName.innerText = `${nombre} ${apellido}`

                    let email = document.createElement("p")
                    email.classList.add("subtitle")
                    email.innerText = correo

            let countryColumn = document.createElement("div")
            countryColumn.classList.add("textColumn")

                let countryName = document.createElement("p")
                countryName.innerText = pais

                let countryRegion = document.createElement("p")
                countryRegion.classList.add("subtitle")
                countryRegion.innerText = region

            let companyColumn = document.createElement("div")
            companyColumn.classList.add("textColumn")
                let companyName = document.createElement("p")
                companyName.innerText = compania

            let cargoColumn = document.createElement("div")
            cargoColumn.classList.add("textColumn")
                let cargoName = document.createElement("p")
                cargoName.innerText = cargo

            let canalColumn = document.createElement("div")
            canalColumn.classList.add("textColumn")
                let canalContainer = document.createElement("canalContainer")
                canalContainer.classList.add("canalContainer")
                    canales.forEach(canal =>{
                        let canalName = document.createElement("p")
                        canalName.classList.add('canalName')
                        canalName.innerText = canal.nombre
                        canalContainer.appendChild(canalName)
                    })

            let interesColumn = document.createElement("div")
            interesColumn.classList.add("interesColumn")
                    intereses.forEach(interes =>{
                        let interesFatherDiv = document.createElement("div")
                        interesFatherDiv.classList.add("interesFatherDiv")
                        let interesText = document.createElement("p")
                            interesText.classList.add("interesText")
                            interesText.innerText = `${interes}%`
    
                            let interesBar = document.createElement("div")
                            interesBar.classList.add("interesBar")
                                let interesBkg = document.createElement("div")
                                if(interes == '0'){
                                    interesBkg.classList.add("interesBkg0")
                                }else if(interes == '25'){
                                    interesBkg.classList.add("interesBkg25")
                                }else if(interes == '50'){
                                    interesBkg.classList.add("interesBkg50")
                                }else if(interes == '75'){
                                    interesBkg.classList.add("interesBkg75")
                                }else if(interes == '100'){
                                    interesBkg.classList.add("interesBkg100")
                                }

                                interesColumn.appendChild(interesFatherDiv)
                                interesFatherDiv.appendChild(interesText)
                                interesFatherDiv.appendChild(interesBar)
                                interesBar.appendChild(interesBkg)
                    })

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
                        
                        selectPutPaises.innerHTML = `<option selected disabled>Seleccionar país</option>`
                        selectPutCiudades.innerHTML = `<option selected disabled>Seleccionar ciudad</option>`

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
                            printPutCompanias(res)}))
                        .catch(error => console.log('error', error));

                        fetch("http://localhost:3000/regiones", requestOptions)
                        .then((response) => {return response})
                        .then((result) => result.json().then((res)=>{
                            printPutRegiones(res)}))
                        .catch(error => console.log('error', error));

                        fetch("http://localhost:3000/canales", requestOptions)
                        .then((response) => {return response})
                        .then((result) => result.json().then((res)=>{
                            printCanalesEdit(res)}))
                        .catch(error => console.log('error', error));

                        printPreferenciasEdit()
                        printInteresesEdit()
                        printContactValues(id)


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
                    deleteButton.addEventListener("click", ()=>{
                        if(popUpBkg.classList.contains("opacityInverseAnim")){
                            popUpBkg.classList.replace("opacityInverseAnim","opacityAnim")
                        }else{
                            popUpBkg.classList.add("opacityAnim")
                        }
                        
                        popUpBkg.style.display = "flex"
                        deleteValidation.style.display = "flex"
                        deleteMessage.innerText = 
                        `¿Desea eliminar a ${nombre} ${apellido} de su lista de contactos?`
                        idSelected = id
                    })
                        let deleteImage = document.createElement("img")
                        deleteImage.classList.add("deleteImage")

                        deleteImage.setAttribute("src","./src/img/deleteIcon.png" )
                        deleteImage.setAttribute("alt","delete")

                    tablaContactos.appendChild(checkColumn)
                        checkColumn.appendChild(checkbox)
                    tablaContactos.appendChild(contactColumn)
                        contactColumn.appendChild(contactImg)
                        contactColumn.appendChild(contactData)
                            contactData.appendChild(contactName)
                            contactData.appendChild(email)
                    tablaContactos.appendChild(countryColumn)
                        countryColumn.appendChild(countryName)
                        countryColumn.appendChild(countryRegion)
                    tablaContactos.appendChild(companyColumn)
                        companyColumn.appendChild(companyName)
                    tablaContactos.appendChild(cargoColumn)
                        cargoColumn.appendChild(cargoName)
                    tablaContactos.appendChild(canalColumn)
                        canalColumn.appendChild(canalContainer)
                    tablaContactos.appendChild(interesColumn)
                        
                    tablaContactos.appendChild(actionsColumn)
                        actionsColumn.appendChild(editButton)
                            editButton.appendChild(editImage)

                        actionsColumn.appendChild(deleteButton)
                            deleteButton.appendChild(deleteImage)
            }
            
        })
        checkColumn = document.querySelectorAll(".checkColumn")
        checkContactos = document.getElementById("checkContactos")
        checkInputs = document.querySelectorAll(".checkColumn input")
        
        checkColumn.forEach(check =>{
            check.addEventListener("click",()=>{
                updateSelectionButton()
            })
        })

        checkContactos.addEventListener("pointerdown", ()=>{
            let checkInputs = document.querySelectorAll(".checkColumn input")
            if(!checkContactos.checked){
                checkInputs.forEach(check =>{
                    if(check !== checkContactos){
                        check.checked = true
                    }
                })
            }else{
                checkInputs.forEach(check =>{
                    if(check !== checkContactos){
                        check.checked = false
                    }
                })
            }
        })
    }
}

function deleteContacto(id){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem("token"));
    
    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    fetch(`http://localhost:3000/contactos/${id}`, requestOptions)
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
        updateTable()
    }))
    .catch(error => console.log('error', error));
}

newContactMain.addEventListener("pointerdown", ()=>{
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem("token"));

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    allCanalContainer.innerHTML = `
                        <div id="firstCanal" class="newCanalContainer">
                            <div class="inputContainer">
                                <label for="nombreCanal">Canal de contacto:</label>
                                    <select name="nombreCanal" class="selectCanales">
                                        <option selected disabled>Seleccionar canal</option>
                                    </select>
                            </div>
        
                            <div class="inputContainer">
                                <label for="cuenta">Cuenta de usuario:</label>
                                    <input type="text" class="inputCuenta" required="true">
                            </div>
        
                            <div class="inputContainer">
                                <label for="nombreCanal">Preferencias:</label>
                                <select name="nombreCanal" class="selectPreferencias">
                                    <option selected disabled>Seleccionar preferencias</option>
                                </select>
                            </div>
        
                            <div class="inputContainer">
                                <label for="nombreCanal">Interes:</label>
                                <select name="nombreCanal" class="selectInteres">
                                    <option  selected disabled>-</option>
                                </select>
                            </div>
    `

    fetch("http://localhost:3000/companias", requestOptions)
        .then((response) => {return response})
        .then((result) => result.json().then((res)=>{
            printCompanias(res)}))
        .catch(error => console.log('error', error));

    fetch("http://localhost:3000/regiones", requestOptions)
        .then((response) => {return response})
        .then((result) => result.json().then((res)=>{
            printRegiones(res)}))
        .catch(error => console.log('error', error));

    fetch("http://localhost:3000/canales", requestOptions)
    .then((response) => {return response})
    .then((result) => result.json().then((res)=>{
        printCanales(res)}))
    .catch(error => console.log('error', error));

    printPreferencias()
    printIntereses()

    if(popUpBkg.classList.contains("opacityInverseAnim")){
        popUpBkg.classList.replace("opacityInverseAnim","opacityAnim")
    }else{
        popUpBkg.classList.add("opacityAnim")
    }
    setTimeout(()=>{
        popUpBkg.style.display = "flex"
        postValidation.style.display = "flex"
    }, 300)


})


deleteButton.addEventListener("pointerdown",()=>{
    deleteContacto(idSelected)
    popUpBkg.classList.add("opacityInverseAnim")
    setTimeout(()=>{
        popUpBkg.style.display = "none"
        deleteValidation.style.display = "none"
    }, 300)
})


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

function updateTable(){
    tablaContactos.innerHTML = `
    <div class="checkColumn columnTitle"><input type="checkbox" name="checkContactos" id="checkContactos" class="checkInput"></div>
    <div class="columnTitle">Contacto</div>
    <div class="columnTitle">Pais/Región</div>
    <div class="columnTitle">Compañia</div>
    <div class="columnTitle">Cargo</div>
    <div class="columnTitle">Canal Preferido</div>
    <div class="columnTitle">Interés</div>
    <div class="columnTitle">Acciones</div>`
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem("token"));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/contactos", requestOptions)
        .then((response) => {return response})
        .then((result) => result.json().then((res)=>{
            printContactos(res)}))
        .catch(error => console.log('error', error));
            

        
}

function buscador(input){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem("token"));

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch(`http://localhost:3000/buscar/${input}`, requestOptions)
    .then((response) => {return response})
    .then((result) => result.json().then((res)=>{res.forEach(array =>{
                if(array.length !== 0){
                    tablaContactos.innerHTML= ` <div class="checkColumn columnTitle"><input type="checkbox" name="checkContactos" id="checkContactos" class="checkInput"></div>
                    <div class="columnTitle">Contacto</div>
                    <div class="columnTitle">Pais/Región</div>
                    <div class="columnTitle">Compañia</div>
                    <div class="columnTitle">Cargo</div>
                    <div class="columnTitle">Canal Preferido</div>
                    <div class="columnTitle">Interés</div>
                    <div class="columnTitle">Acciones</div>`
                    printContactos(array)
                }
            })
        }
    ))
    .catch(error => console.log('error', error));

    fetch(`http://localhost:3000/buscadorPorPaises/${input}`, requestOptions)
    .then((response) => {return response})
    .then((result) => result.json().then((array)=>{
            if(array.length !== 0){
                tablaContactos.innerHTML= ` <div class="checkColumn columnTitle"><input type="checkbox" name="checkContactos" id="checkContactos" class="checkInput"></div>
                <div class="columnTitle">Contacto</div>
                <div class="columnTitle">Pais/Región</div>
                <div class="columnTitle">Compañia</div>
                <div class="columnTitle">Cargo</div>
                <div class="columnTitle">Canal Preferido</div>
                <div class="columnTitle">Interés</div>
                <div class="columnTitle">Acciones</div>`
                printContactos(array)
            }
        }
    ))
    .catch(error => console.log('error', error));

    fetch(`http://localhost:3000/buscadorPorCiudades/${input}`, requestOptions)
    .then((response) => {return response})
    .then((result) => result.json().then((array)=>{
        if(array.length !== 0){
            tablaContactos.innerHTML= ` <div class="checkColumn columnTitle"><input type="checkbox" name="checkContactos" id="checkContactos" class="checkInput"></div>
            <div class="columnTitle">Contacto</div>
            <div class="columnTitle">Pais/Región</div>
            <div class="columnTitle">Compañia</div>
            <div class="columnTitle">Cargo</div>
            <div class="columnTitle">Canal Preferido</div>
            <div class="columnTitle">Interés</div>
            <div class="columnTitle">Acciones</div>`
            printContactos(array)
        }
    }
))
    .catch(error => console.log('error', error));

    fetch(`http://localhost:3000/buscadorPorRegion/${input}`, requestOptions)
    .then((response) => {return response})
    .then((result) => result.json().then((array)=>{
        if(array.length !== 0){
            tablaContactos.innerHTML= ` <div class="checkColumn columnTitle"><input type="checkbox" name="checkContactos" id="checkContactos" class="checkInput"></div>
            <div class="columnTitle">Contacto</div>
            <div class="columnTitle">Pais/Región</div>
            <div class="columnTitle">Compañia</div>
            <div class="columnTitle">Cargo</div>
            <div class="columnTitle">Canal Preferido</div>
            <div class="columnTitle">Interés</div>
            <div class="columnTitle">Acciones</div>`
            printContactos(array)
        }
    }
))
    .catch(error => console.log('error', error));

    fetch(`http://localhost:3000/buscadorPorCanales/${input}`, requestOptions)
    .then((response) => {return response})
    .then((result) => result.json().then((array)=>{
        if(array.length !== 0){
            tablaContactos.innerHTML= ` <div class="checkColumn columnTitle"><input type="checkbox" name="checkContactos" id="checkContactos" class="checkInput"></div>
            <div class="columnTitle">Contacto</div>
            <div class="columnTitle">Pais/Región</div>
            <div class="columnTitle">Compañia</div>
            <div class="columnTitle">Cargo</div>
            <div class="columnTitle">Canal Preferido</div>
            <div class="columnTitle">Interés</div>
            <div class="columnTitle">Acciones</div>`
            printContactos(array)
        }
    }
))
    .catch(error => console.log('error', error));

    fetch(`http://localhost:3000/buscadorPorCompania/${input}`, requestOptions)
    .then((response) => {return response})
    .then((result) => result.json().then((array)=>{
        if(array.length !== 0){
            tablaContactos.innerHTML= ` <div class="checkColumn columnTitle"><input type="checkbox" name="checkContactos" id="checkContactos" class="checkInput"></div>
            <div class="columnTitle">Contacto</div>
            <div class="columnTitle">Pais/Región</div>
            <div class="columnTitle">Compañia</div>
            <div class="columnTitle">Cargo</div>
            <div class="columnTitle">Canal Preferido</div>
            <div class="columnTitle">Interés</div>
            <div class="columnTitle">Acciones</div>`
            printContactos(array)
        }
    }
))
    .catch(error => console.log('error', error));

    
    
}

searchButton.addEventListener("pointerdown", ()=>{
    buscador(searchInput.value)
    
})

searchInput.addEventListener("keypress",(event)=>{
    if(event.code == "Enter"){
        buscador(searchInput.value)
        
    }
})

searchInput.addEventListener("keyup",(event)=>{
    if(searchInput.value == ""){
        updateTable()
        
    }
})

