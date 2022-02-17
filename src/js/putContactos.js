
const putContactButton = document.querySelector(".putContactButton")

const putNombre = document.getElementById("putNombre")
const putApellido = document.getElementById("putApellido")
const putCorreo = document.getElementById("putCorreo")
const putCargo = document.getElementById("putCargo")
const putInputImagen = document.getElementById("putInputImagen")

const selectPutCompania = document.getElementById("selectPutCompania")
const selectPutRegiones = document.getElementById("selectPutRegiones")
const selectPutPaises = document.getElementById("selectPutPaises")
const selectPutCiudades = document.getElementById("selectPutCiudades")

const errorContainerEdit = document.querySelectorAll(".errorContainerEdit")
let selectCanalEdit = document.querySelectorAll(".selectCanalEdit")
let selectPreferenciasEdit = document.querySelectorAll(".selectPreferenciasEdit")
let selectInteresEdit = document.querySelectorAll(".selectInteresEdit")
let inputCuentaEdit = document.querySelectorAll(".inputCuentaEdit")

let addChannelButtonEdit = document.querySelector(".addChannelEdit")
let deleteChannelButtonEdit = document.querySelector(".deleteChannelEdit")
const allCanalContainerEdit = document.querySelector(".allCanalContainerEdit")

    addChannelsFunctionEdit()
    deleteChannelFunctionEdit()

    putContactButton.addEventListener("pointerdown", ()=>{
        let newNombre = document.getElementById("putNombre").value
        let newApellido = document.getElementById("putApellido").value
        let newCorreo = document.getElementById("putCorreo").value
        let newCargo = document.getElementById("putCargo").value
        let newCompania = selectPutCompania.value
        console.log(newCompania)
        let newContactCiudad = selectPutCiudades.value

        let newContactCanales = []
        let selectCanalEdit = document.querySelectorAll(".selectCanalEdit")
        let selectInteresEdit = document.querySelectorAll(".selectInteresEdit")
        let selectPreferenciasEdit = document.querySelectorAll(".selectPreferenciasEdit")
        let inputCuentaEdit = document.querySelectorAll(".inputCuentaEdit")
        console.log(selectCanalEdit.length)
        for (let i = 0; i < selectCanalEdit.length; i++) {
            let newCanal = {
                canale_id: selectCanalEdit[i].value,
                cuenta: inputCuentaEdit[i].value,
                preferencias: selectPreferenciasEdit[i].value,
                interes: selectInteresEdit[i].value
            }
            newContactCanales.push(newCanal)
        }

        const newContact= {
            nombre: newNombre,
            apellido: newApellido,
            correo: newCorreo,
            cargo: newCargo,
            ciudades_id: parseInt(newContactCiudad),
            companias_id: newCompania,
            canales: newContactCanales
        }

        console.log(newContact.canales)


        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(newContact);

        var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        let contactPromise = fetch(`http://localhost:3000/contactos/${idSelected}`, requestOptions)
        .then((response) => {return response})
            .then((result) => result.json().then((contacto)=>{
                console.log(contacto)
            }))
            .catch(error => console.log('error', error));

        let contactCanalsPromise = fetch(`http://localhost:3000/contactosHasCanales/${idSelected}`, requestOptions)
        .then((response) => {return response})
            .then((result) => result.json().then((contacto)=>{
                console.log(contacto)
            }))
            .catch(error => console.log('error', error));
        
        Promise.all([contactPromise, contactCanalsPromise]).then(()=>{
            popUpBkg.classList.replace("opacityAnim","opacityInverseAnim")
            setTimeout(()=>{
                popUpBkg.style.display = "none"
                validationsContainer.forEach(container=>{
                container.style.display = "none"
                })
                messageContainer.innerText = "Contacto modificado con exito"
                messageContainer.classList.replace("opacityInverseAnim", "opacityAnim")
                setTimeout(()=>{
                    messageContainer.classList.replace("opacityAnim", "opacityInverseAnim")
                    setTimeout(()=>{

                        messageContainer.innerText = ""
                    },300)
                },2000)
                updateTable()
            }, 300)
        
        })

    })

    function printPutCompanias(companias){
       selectPutCompania.innerHTML = `<option selected disabled>Seleccionar Compañía</option>`
        companias.forEach(compania =>{
            let posibleCompania = document.createElement("option")
            posibleCompania.value = compania.id
            posibleCompania.text = compania.nombre
            selectPutCompania.appendChild(posibleCompania)
        })
    }
    
    function printPutRegiones(regiones){
        selectPutRegiones.innerHTML = `<option selected disabled>Seleccionar región</option>`
        regiones.forEach(region =>{
            let posibleRegion = document.createElement("option")
            posibleRegion.value = region.id
            posibleRegion.text = region.nombre
            selectPutRegiones.appendChild(posibleRegion)
        })
    } 
    
    function printCanalesEdit(canales){
        selectCanalEdit = document.querySelectorAll(".selectCanalEdit")
        selectCanalEdit.forEach(select =>{
            if(select.children.length ==1){
                canales.forEach(canal =>{
                    let posibleCanal = document.createElement("option")
                    posibleCanal.value = canal.id
                    posibleCanal.text = canal.nombre
                    select.appendChild(posibleCanal)
                })
            }
        })
    } 
    
    function printPreferenciasEdit(){
        selectPreferenciasEdit = document.querySelectorAll(".selectPreferenciasEdit")
        selectPreferenciasEdit.forEach(select =>{
            if(select.children.length == 1){
                preferencias.forEach(preferencia =>{
                    let posiblePreferencia = document.createElement("option")
                    posiblePreferencia.text = preferencia
                    posiblePreferencia.value = preferencia
                    select.appendChild(posiblePreferencia)
                })
            }
        })
    }
    
    function printInteresesEdit(){
        selectInteresEdit = document.querySelectorAll(".selectInteresEdit")
        selectInteresEdit.forEach(select =>{
            if(select.children.length == 1){
                intereses.forEach(interes =>{
                    let posibleInteres = document.createElement("option")
                    posibleInteres.text = interes
                    posibleInteres.value = interes
                    select.appendChild(posibleInteres)
                })
            }
        })
    }
    
    function printPutPaises(){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem('token'));
    
        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
        fetch(`http://localhost:3000/paises/${selectPutRegiones.value}`, requestOptions)
        .then((response) => {return response})
            .then((result) => result.json().then((paises)=>{
                if(selectPutPaises.children.length !== 1 && selectPutPaises.value !== "Seleccionar país"){
                    selectPutPaises.innerHTML = `<option selected disabled>Seleccionar país</option>`
                    selectPutCiudades.innerHTML = `<option selected disabled>Seleccionar ciudad</option>`
                }
                paises.forEach(pais =>{
                    let posiblePais = document.createElement("option")
                    posiblePais.value = pais.id
                    posiblePais.text = pais.nombre
                    selectPutPaises.appendChild(posiblePais)
                })
            }))
            .catch(error => console.log('error', error));
    }
    
    function printPutCiudades(){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem('token'));
    
        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
    
        fetch(`http://localhost:3000/ciudades/${selectPutPaises.value}`, requestOptions)
        .then((response) => {return response})
            .then((result) => result.json().then((ciudades)=>{
                if(selectPutCiudades.children.length !== 1){
                    selectPutCiudades.innerHTML = `<option selected disabled>Seleccionar ciudad</option>`
                }
                ciudades.forEach(ciudad =>{
                    let posibleCiudad = document.createElement("option")
                    posibleCiudad.value = ciudad.id
                    posibleCiudad.text = ciudad.nombre
                    selectPutCiudades.appendChild(posibleCiudad)
                })
            }))
            .catch(error => console.log('error', error));
    }
    
    function addChannelsFunctionEdit(){
        addChannelButtonEdit.addEventListener("pointerdown", ()=>{
            let newCanalContainer = document.createElement("div")
                newCanalContainer.classList.add("newCanalContainer")
                newCanalContainer.innerHTML = `
                <div class="inputContainer">
                        <label for="nombreCanal">Canal de contacto:</label>
                            <select name="nombreCanal" class="selectCanalEdit">
                                <option selected disabled>Seleccionar canal</option>
                            </select>
                    </div>
    
                    <div class="inputContainer">
                        <label for="cuenta">Cuenta de usuario:</label>
                            <input type="text" class="inputCuentaEdit" required="true">
                    </div>
    
                    <div class="inputContainer">
                        <label for="nombreCanal">Preferencias:</label>
                        <select name="nombreCanal" class="selectPreferenciasEdit">
                            <option selected disabled>Seleccionar Preferencias</option>
                        </select>
                    </div>
    
                    <div class="inputContainer">
                        <label for="nombreCanal">Interes:</label>
                        <select name="nombreCanal" class="selectInteresEdit">
                            <option  selected disabled>-</option>
                        </select>
                    </div>
    
                `
                allCanalContainerEdit.appendChild(newCanalContainer)
                fetch("http://localhost:3000/canales", requestOptions)
                .then((response) => {return response})
                .then((result) => result.json().then((res)=>{
                    printCanalesEdit(res)}))
                .catch(error => console.log('error', error));
    
                printPreferenciasEdit()
                printInteresesEdit()
        })
    }
    
    function deleteChannelFunctionEdit(){
        deleteChannelButtonEdit.addEventListener("pointerdown", ()=>{
            allCanalContainerEdit.removeChild(allCanalContainerEdit.lastChild)
        })
    
    }

    function printContactValues(id){
        fetch(`http://localhost:3000/contactos/${id}`, requestOptions)
        .then((response) => {return response})
        .then((result) => result.json().then((res)=>{
            putNombre.value = res[0].nombre
            putApellido.value = res[0].apellido
            putCorreo.value = res[0].correo
            putInputImagen.value = res[0].imagen
            putCargo.value = res[0].cargo 
            
            selectPutCompania.firstElementChild.value = res[0].compania.id
            selectPutCompania.firstElementChild.innerText = res[0].compania.nombre
            selectPutCompania.value = res[0].compania.id

            selectPutRegiones.firstElementChild.value = res[0].regione.id
            selectPutRegiones.firstElementChild.innerText = res[0].regione.nombre
            selectPutRegiones.value = res[0].regione.id

            printPutPaises()
            selectPutPaises.firstElementChild.value = res[0].paise.id
            selectPutPaises.firstElementChild.innerText = res[0].paise.nombre
            selectPutPaises.value = res[0].paise.id

            printPutCiudades()
            selectPutCiudades.firstElementChild.value = res[0].cuidade.id
            selectPutCiudades.firstElementChild.innerText = res[0].cuidade.nombre
            selectPutCiudades.value = res[0].cuidade.nombre 
             
            selectPutCiudades.firstElementChild.innerText = res[0].cuidade.nombre
            

            allCanalContainerEdit.innerHTML = ""
            res[0].canales.forEach(canal =>{
                let newCanalContainer = document.createElement("div")
                newCanalContainer.classList.add("newCanalContainer")
                newCanalContainer.innerHTML = `
                <div class="inputContainer">
                                <label for="nombreCanal">Canal de contacto:</label>
                                    <select name="nombreCanal" class="selectCanalEdit" value=${canal.id}>
                                        <option selected disabled value=${canal.id}>${canal.nombre}</option>
                                    </select>
                            </div>
        
                            <div class="inputContainer">
                                <label for="cuenta">Cuenta de usuario:</label>
                                    <input type="text" class="inputCuentaEdit" required="true" value=${canal.contactos_has_canales.cuenta}>
                            </div>
        
                            <div class="inputContainer">
                                <label for="nombreCanal">Preferencias:</label>
                                <select name="nombreCanal" class="selectPreferenciasEdit" value=${canal.contactos_has_canales.preferencias}>
                                    <option selected disabled>${canal.contactos_has_canales.preferencias}</option>
                                </select>
                            </div>
        
                            <div class="inputContainer">
                                <label for="nombreCanal">Interes:</label>
                                <select name="nombreCanal" class="selectInteresEdit" value=${canal.contactos_has_canales.interes}>
                                    <option  selected disabled>${canal.contactos_has_canales.interes}</option>
                                </select>
                            </div>
                `
                allCanalContainerEdit.appendChild(newCanalContainer)
            })
            fetch("http://localhost:3000/canales", requestOptions)
            .then((response) => {return response})
            .then((result) => result.json().then((res)=>{
                printCanalesEdit(res)}))
            .catch(error => console.log('error', error));

            printPreferenciasEdit()
            printInteresesEdit()




            }
        ))
        .catch(error => console.log('error', error));
    }