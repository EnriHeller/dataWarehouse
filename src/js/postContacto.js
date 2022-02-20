
const newContactButton = document.querySelector(".newContactButton")
const selectCompania = document.getElementById("selectCompania")
const selectRegiones = document.getElementById("selectRegiones")
const selectPaises = document.getElementById("selectPaises")
const selectCiudades = document.getElementById("selectCiudades")
const errorContainer = document.querySelectorAll(".errorContainer")
const contactImg = document.getElementById("contactImg")

inputImagen.addEventListener("onchange",()=>{
    try {
        contactImg.src = inputImagen.value
    } catch (error) {}
})


let selectCanales = document.querySelectorAll(".selectCanales")
let selectPreferencias = document.querySelectorAll(".selectPreferencias")
let selectInteres = document.querySelectorAll(".selectInteres")
let inputCuenta = document.querySelectorAll(".inputCuenta")

let addChannelButton = document.querySelector(".addChannel")
let deleteChannelButton = document.querySelector(".deleteChannel")
const allCanalContainer = document.querySelector(".allCanalContainer")

const intereses = [
    '0',
    '25',
    '50',
    '75',
    '100'];

const preferencias = [
    "NO MOLESTAR",
    "ACTIVO",
    "EN EL TRABAJO",
    "AUSENTE"
];

    addChannelsFunction()
    deleteChannelFunction()

    newContactButton.addEventListener("pointerdown", ()=>{
        let newNombre = document.getElementById("nombre").value
        let newApellido = document.getElementById("apellido").value
        let newCorreo = document.getElementById("correo").value
        let newCargo = document.getElementById("cargo").value
        let newDireccion = document.getElementById("inputDireccion").value
        let newImagen = inputImagen.value
        let newCompania = selectCompania.value
        let newContactCiudad = selectCiudades.value
        let newContactCanales = []
        

        selectCanales = document.querySelectorAll(".selectCanales")
        selectInteres = document.querySelectorAll(".selectInteres")
        selectPreferencias = document.querySelectorAll(".selectPreferencias")
        inputCuenta = document.querySelectorAll(".inputCuenta")
        for (let i = 0; i < selectCanales.length; i++) {
            let newCanal = {
                canale_id: selectCanales[i].value,
                cuenta: inputCuenta[i].value,
                preferencias: selectPreferencias[i].value,
                interes: selectInteres[i].value
            }
            
            let canalPreExist = newContactCanales.find(canalGuardado=>{
                if(canalGuardado.canale_id == newCanal.canale_id){
                    return canalGuardado
                }
            })
            if(canalPreExist == null){
                newContactCanales.push(newCanal)
            }
        }

        const newContact= {
            nombre: newNombre,
            apellido: newApellido,
            correo: newCorreo,
            cargo: newCargo,
            direccion: newDireccion,
            ciudades_id: newContactCiudad,
            companias_id: newCompania,
            canales: newContactCanales,
            imagen: newImagen
        }

        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(newContact);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("http://localhost:3000/contactos", requestOptions)
        .then((response) => {return response})
        .then((result) => {
            if(result.status == 200){
                errorContainer.forEach(container =>{
                    container.innerText = ""
                })
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
                        updateTable()
                    }, 300)
                })
            }else{
                result.json().then((res)=>{
                    errorContainer.forEach(container =>{
                        container.innerText = res.error
                    })
                })
            }
        })
        .catch(error => console.log('error', error));
    })

    function printCompanias(companias){
        selectCompania.innerHTML = `<option selected disabled>Seleccionar Compañía</option>`
        companias.forEach(compania =>{
            let posibleCompania = document.createElement("option")
            posibleCompania.value = compania.id
            posibleCompania.text = compania.nombre
            selectCompania.appendChild(posibleCompania)
        })
    }
    
    function printRegiones(regiones){
        selectRegiones.innerHTML = `<option id="region" selected disabled>Seleccionar región</option>`
        regiones.forEach(region =>{
            let posibleRegion = document.createElement("option")
            posibleRegion.value = region.id
            posibleRegion.text = region.nombre
            selectRegiones.appendChild(posibleRegion)
        })
    } 
    
    function printCanales(canales){
        selectCanales = document.querySelectorAll(".selectCanales")
        selectCanales.forEach(select =>{
            if(select.children.length == 1){
                select.innerHTML = `<option selected disabled>Seleccionar canal</option>`
                canales.forEach(canal =>{
                    let posibleCanal = document.createElement("option")
                    posibleCanal.value = canal.id
                    posibleCanal.text = canal.nombre
                    select.appendChild(posibleCanal)
                })
            }
        })
    } 
    
    function printPreferencias(){
        selectPreferencias = document.querySelectorAll(".selectPreferencias")
        selectPreferencias.forEach(select =>{
            if(select.children.length == 1){
                select.innerHTML = `<option selected disabled>Seleccionar preferencias</option>`
                preferencias.forEach(preferencia =>{
                    let posiblePreferencia = document.createElement("option")
                    posiblePreferencia.text = preferencia
                    posiblePreferencia.value = preferencia
                    select.appendChild(posiblePreferencia)
                })
            }
        })
    }
    
    function printIntereses(){
        selectInteres = document.querySelectorAll(".selectInteres")
        selectInteres.forEach(select =>{
            if(select.children.length == 1){
                select.innerHTML = `<option selected disabled>-</option>`
                intereses.forEach(interes =>{
                    let posibleInteres = document.createElement("option")
                    posibleInteres.text = interes
                    posibleInteres.value = interes
                    select.appendChild(posibleInteres)
                })
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
    
    function addChannelsFunction(){
        addChannelButton.addEventListener("pointerdown", ()=>{
            let newCanalContainer = document.createElement("div")
                newCanalContainer.classList.add("newCanalContainer")
                newCanalContainer.innerHTML = `
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
                allCanalContainer.appendChild(newCanalContainer)
                
                var myHeaders = new Headers();
                myHeaders.append("Authorization", localStorage.getItem('token'));
                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                fetch("http://localhost:3000/canales", requestOptions)
                .then((response) => {return response})
                .then((result) => result.json().then((res)=>{
                    printCanales(res)}))
                .catch(error => console.log('error', error));
    
                printPreferencias()
                printIntereses()
        })
    }
    
    function deleteChannelFunction(){
        deleteChannelButton.addEventListener("pointerdown", ()=>{
            allCanalContainer.removeChild(allCanalContainer.lastChild)
        })
    
    }