const tablaContactos = document.getElementById('tablaContactos')
const checkContactos = document.getElementById("checkContactos")
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
var myHeaders = new Headers();
myHeaders.append("Authorization", localStorage.getItem("token"));

var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

fetch("http://localhost:3000/contactos", requestOptions)
    .then((response) => {return response})
    .then((result) => result.json().then((res)=>{printContactos(res)}))
    .catch(error => console.log('error', error));


function printContactos(arrayContactos){
    console.log(arrayContactos)
    if(arrayContactos.length !== 0){
        arrayContactos.forEach(objetoContacto=>{
            /* get info */
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
                                interesBkg.classList.add("interesBkg")

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

                    let deleteButton = document.createElement("a")
                    deleteButton.classList.add("deleteButton")
                    deleteButton.addEventListener("click", ()=>{
                        deleteContacto(id)
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
    .then((result) => result.json().then((res)=>{console.log(res)}))
    .catch(error => console.log('error', error));
}