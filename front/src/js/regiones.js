const popUpBkg = document.querySelector(".popUpBkg")
const contentFather = document.getElementById("contentFather")
const newRegionButton = document.getElementById("newRegionButton")
const backButtons = document.querySelectorAll(".backButton")
const validationsContainer = document.querySelectorAll(".validationContainer")
const errorContainer = document.querySelectorAll(".errorContainer")
const messageContainer = document.querySelector(".messageContainer")

/* post validation containers */
const postValidationRegion = document.getElementById("postValidationRegion")
const nombreRegion = document.getElementById("nombreRegion")
const confirmRegionButton = document.getElementById("confirmRegionButton")

const postValidationPais = document.getElementById("postValidationPais")
const nombrePais = document.getElementById("nombrePais")
const confirmPaisButton = document.getElementById("confirmPaisButton")

const postValidationCiudad = document.getElementById("postValidationCiudad")
const nombreCiudad = document.getElementById("nombreCiudad")
const confirmCiudadButton = document.getElementById("confirmCiudadButton")

/* edit validation containers */
const editValidationRegion = document.getElementById("editValidationRegion")
const nombreRegionEdit = document.getElementById("nombreRegionEdit")
const editRegionButton = document.getElementById("editRegionButton")

const editValidationPais = document.getElementById("editValidationPais")
const nombrePaisEdit = document.getElementById("nombrePaisEdit")
const editPaisButton = document.getElementById("editPaisButton")

const editValidationCiudad = document.getElementById("editValidationCiudad")
const nombreCiudadEdit = document.getElementById("nombreCiudadEdit")
const editCiudadButton = document.getElementById("editCiudadButton")

/* delete validation containers */
const deleteValidationRegion = document.getElementById("deleteValidationRegion")
const deleteMessageRegion = document.getElementById("deleteMessageRegion")
const deleteButtonRegion = document.getElementById("deleteButtonRegion")

const deleteValidationPais = document.getElementById("deleteValidationPais")
const deleteMessagePais = document.getElementById("deleteMessagePais")
const deleteButtonPais = document.getElementById("deleteButtonPais")

const deleteValidationCiudad = document.getElementById("deleteValidationCiudad")
const deleteMessageCiudad = document.getElementById("deleteMessageCiudad")
const deleteButtonCiudad = document.getElementById("deleteButtonCiudad")

let idSelected;

getRegiones()

function getRegiones(){
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
            if(!res[res.length-1].av){
                document.getElementById("usersButton").style.display = "none"
            }
            popUpBkg.classList.add("opacityInverseAnim")
            setTimeout(()=>{
                popUpBkg.style.display = "none"
                popUpBkg.style.backgroundColor = "#0d093f75" //$popup-color
                printRegiones(res)
            },300)
        }))
        .catch((error)=>{
            console.log(error.message)
            //window.location.href = "/index.html"
        });
}

function printRegiones(regiones){
    console.log(regiones)
    regiones.forEach((region)=>{
        if(region.nombre){
            const tablaRegiones = document.createElement("div")
            tablaRegiones.setAttribute("regionid", region.id)
            tablaRegiones.classList.add("tablaRegiones")
                const regionRow = document.createElement("div")
                regionRow.classList.add("regionRow")
                regionRow.classList.add("columnTitle")
                    const regionName = document.createElement("p")
                    regionName.classList.add("locationName")
                    regionName.innerText= region.nombre
    
                    const buttonsContainer = document.createElement("div")
                    buttonsContainer.classList.add("buttonsContainer")
    
                        const addButton = document.createElement("a")
                        addButton.classList.add("addButton")
                        addButton.classList.add("optionButton")
                            const addImgButton = document.createElement("img")
                            addImgButton.classList.add("imgButton")
                            addImgButton.setAttribute("src", "/src/img/addIcon.png")
                            addImgButton.setAttribute("alt", "Editar")

                        addButton.addEventListener("click", ()=>{
                            idSelected = region.id
                            launchPostValidation(postValidationPais)
                        })
    
                        const editButton = document.createElement("a")
                        editButton.classList.add("editButton")
                        editButton.classList.add("optionButton")
                            const editImgButton = document.createElement("img")
                            editImgButton.classList.add("imgButton")
                            editImgButton.setAttribute("src", "/src/img/editIcon.png")
                            editImgButton.setAttribute("alt", "Editar")
                        editButton.addEventListener("click", ()=>{
                            idSelected = region.id
                            launchEditValidation(editValidationRegion, region.nombre)
                        })
    
                        const deleteButton = document.createElement("a")
                        deleteButton.classList.add("deleteButton")
                        deleteButton.classList.add("optionButton")
                            const deleteImgButton = document.createElement("img")
                            deleteImgButton.classList.add("imgButton")
                            deleteImgButton.setAttribute("src", "/src/img/deleteIcon.png")
                            deleteImgButton.setAttribute("alt", "Eliminar")
                        deleteButton.addEventListener("click", ()=>{
                            idSelected = region.id
                            launchDeleteValidation(deleteValidationRegion, region.nombre)
                        })
    
                        contentFather.appendChild(tablaRegiones)
                            tablaRegiones.appendChild(regionRow)
                                regionRow.appendChild(regionName)
                                regionRow.appendChild(buttonsContainer)
                                    buttonsContainer.appendChild(addButton)
                                    addButton.appendChild(addImgButton)
                                    buttonsContainer.appendChild(editButton)
                                    editButton.appendChild(editImgButton)
                                    buttonsContainer.appendChild(deleteButton)
                                    deleteButton.appendChild(deleteImgButton)
    
                        getPaises(region.id)
        }
        
    })
}

function getPaises(regionId){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem("token"));
    
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    
    fetch(`http://localhost:3000/paises/${regionId}`, requestOptions)
        .then((response) => {return response})
        .then((result) => result.json().then((paises)=>{
            const regiones = document.querySelectorAll(".tablaRegiones")
            const regionesArray = [...regiones]
            const regionContainer = regionesArray.find((region)=>{
            if(region.attributes.regionid.value == regionId){
                return region
            }
            })

            paises.forEach((pais)=>{
                
                const tablaPaises = document.createElement("div")
                tablaPaises.setAttribute("paisid", pais.id)
                tablaPaises.classList.add("tablaPaises")
                    const paisRow = document.createElement("div")
                    paisRow.classList.add("paisRow")
                    paisRow.classList.add("columnTitle")
                        const paisName = document.createElement("p")
                        paisName.classList.add("locationName")
                        paisName.innerText= pais.nombre
        
                        const buttonsContainer = document.createElement("div")
                        buttonsContainer.classList.add("buttonsContainer")
        
                            const addButton = document.createElement("a")
                            addButton.classList.add("addButton")
                            addButton.classList.add("optionButton")
                                const addImgButton = document.createElement("img")
                                addImgButton.classList.add("imgButton")
                                addImgButton.setAttribute("src", "/src/img/addIcon.png")
                                addImgButton.setAttribute("alt", "Editar")
                                addButton.addEventListener("click", ()=>{
                                    idSelected = pais.id
                                    launchPostValidation(postValidationCiudad)
                                })
        
                            const editButton = document.createElement("a")
                            editButton.classList.add("editButton")
                            editButton.classList.add("optionButton")
                                const editImgButton = document.createElement("img")
                                editImgButton.classList.add("imgButton")
                                editImgButton.setAttribute("src", "/src/img/editIcon.png")
                                editImgButton.setAttribute("alt", "Editar")
                            editButton.addEventListener("click", ()=>{
                            idSelected = pais.id
                            launchEditValidation(editValidationPais, pais.nombre)
                        })
        
                            const deleteButton = document.createElement("a")
                            deleteButton.classList.add("deleteButton")
                            deleteButton.classList.add("optionButton")
                                const deleteImgButton = document.createElement("img")
                                deleteImgButton.classList.add("imgButton")
                                deleteImgButton.setAttribute("src", "/src/img/deleteIcon.png")
                                deleteImgButton.setAttribute("alt", "Eliminar")
                            deleteButton.addEventListener("click", ()=>{
                                idSelected = pais.id
                                launchDeleteValidation(deleteValidationPais, pais.nombre)
                            })
        
                            regionContainer.appendChild(tablaPaises)
                                tablaPaises.appendChild(paisRow)
                                    paisRow.appendChild(paisName)
                                    paisRow.appendChild(buttonsContainer)
                                        buttonsContainer.appendChild(addButton)
                                        addButton.appendChild(addImgButton)
                                        buttonsContainer.appendChild(editButton)
                                        editButton.appendChild(editImgButton)
                                        buttonsContainer.appendChild(deleteButton)
                                        deleteButton.appendChild(deleteImgButton)

                                        getCiudades(pais.id)

            })

        }))
        .catch((error)=>{
            console.log(error.message)
        });
}

function getCiudades(paisId){

    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem("token"));
    
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    
    fetch(`http://localhost:3000/ciudades/${paisId}`, requestOptions)
        .then((response) => {return response})
        .then((result) => result.json().then((ciudades)=>{
            const paises = document.querySelectorAll(".tablaPaises")
            const paisesArray = [...paises]
            const paisContainer = paisesArray.find((pais)=>{
            if(pais.attributes.paisid.value == paisId){
                return pais
            }
            })

            ciudades.forEach((ciudad)=>{
                
                const tablaCiudades = document.createElement("div")
                tablaCiudades.classList.add("tablaCiudades")
                    const ciudadRow = document.createElement("div")
                    ciudadRow.classList.add("ciudadRow")
                    ciudadRow.classList.add("columnTitle")
                        const ciudadName = document.createElement("p")
                        ciudadName.classList.add("locationName")
                        ciudadName.innerText= ciudad.nombre
        
                        const buttonsContainer = document.createElement("div")
                        buttonsContainer.classList.add("buttonsContainer")
        
                            const editButton = document.createElement("a")
                            editButton.classList.add("editButton")
                            editButton.classList.add("optionButton")
                                const editImgButton = document.createElement("img")
                                editImgButton.classList.add("imgButton")
                                editImgButton.setAttribute("src", "/src/img/editIcon.png")
                                editImgButton.setAttribute("alt", "Editar")
                            editButton.addEventListener("click", ()=>{
                            idSelected = ciudad.id
                            launchEditValidation(editValidationCiudad, ciudad.nombre)
                            })
        
                            const deleteButton = document.createElement("a")
                            deleteButton.classList.add("deleteButton")
                            deleteButton.classList.add("optionButton")
                                const deleteImgButton = document.createElement("img")
                                deleteImgButton.classList.add("imgButton")
                                deleteImgButton.setAttribute("src", "/src/img/deleteIcon.png")
                                deleteImgButton.setAttribute("alt", "Eliminar")
                            deleteButton.addEventListener("click", ()=>{
                                idSelected = ciudad.id
                                launchDeleteValidation(deleteValidationCiudad, ciudad.nombre)
                            })
        
                            paisContainer.appendChild(tablaCiudades)
                                tablaCiudades.appendChild(ciudadRow)
                                    ciudadRow.appendChild(ciudadName)
                                    ciudadRow.appendChild(buttonsContainer)
                                        buttonsContainer.appendChild(editButton)
                                        editButton.appendChild(editImgButton)
                                        buttonsContainer.appendChild(deleteButton)
                                        deleteButton.appendChild(deleteImgButton)


            })

        }))
        .catch((error)=>{
            console.log(error.message)
        });
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

function updateTable(){
    contentFather.innerHTML = ``
    getRegiones()
}

/* POST FUNCTIONS */
newRegionButton.addEventListener("click",()=>{
    launchPostValidation(postValidationRegion)
})

function launchPostValidation(container){
    if(popUpBkg.classList.contains("opacityInverseAnim")){
        popUpBkg.classList.replace("opacityInverseAnim","opacityAnim")
    }else{
        popUpBkg.classList.add("opacityAnim")
    }
    setTimeout(()=>{
        popUpBkg.style.display = "flex"
        container.style.display = "flex"
    }, 300)
}

confirmRegionButton.addEventListener("click",()=>{
    postLocation("regiones", {nombre: nombreRegion.value})
})
confirmPaisButton.addEventListener("click",()=>{
    postLocation("paises", {nombre: nombrePais.value, regiones_id: idSelected})
})
confirmCiudadButton.addEventListener("click",()=>{
    postLocation("ciudades", {nombre: nombreCiudad.value, paises_id: idSelected})
})

function postLocation(locationType, rawObject){
    try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");
        
        var raw = JSON.stringify(rawObject);
        
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`http://localhost:3000/${locationType}`, requestOptions)
        .then((response) => {return response})
        .then((result) => {
            if(result.status == 200){
                errorContainer.forEach(container=>{
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
                    errorContainer.forEach(container=>{
                        if(res.error){
                            container.innerText = res.error
                        }else{
                            container.innerText = res
                        }
                    })
                })
            }
        })
        .catch(error => console.log('error', error));
    }catch (error) {
        errorContainer.innerText = error.message
        console.log(error.message)
    }
} 

/* EDIT FUNCTIONS */
function launchEditValidation(container, nombre){
    if(container == editValidationRegion){
        nombreRegionEdit.value = nombre
    }else if(container == editValidationPais){
        nombrePaisEdit.value = nombre
    }else if(container == editValidationCiudad){
        nombreCiudadEdit.value = nombre
    }
    
    if(popUpBkg.classList.contains("opacityInverseAnim")){
        popUpBkg.classList.replace("opacityInverseAnim","opacityAnim")
    }else{
        popUpBkg.classList.add("opacityAnim")
    }
    setTimeout(()=>{
        popUpBkg.style.display = "flex"
        container.style.display = "flex"
    }, 300)
}

editRegionButton.addEventListener("click", ()=>{
    editLocation("regiones", {
        nombre: nombreRegionEdit.value
    })
})
editPaisButton.addEventListener("click", ()=>{
    editLocation("paises", {
        nombre: nombrePaisEdit.value
    })
})
editCiudadButton.addEventListener("click", ()=>{
    editLocation("ciudades", {
        nombre: nombreCiudadEdit.value
    })
})

function editLocation(locationType, rawObject){
    try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", localStorage.getItem("token"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(rawObject);

        var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch(`http://localhost:3000/${locationType}/${idSelected}`, requestOptions)
        .then((response) => {return response})
        .then((result) => {
            if(result.status == 200){
                errorContainer.forEach(container=>{
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
                    errorContainer.forEach(container=>{
                        if(res.error){
                            container.innerText = res.error
                        }else{
                            container.innerText = res
                        }
                    })
                })
            }
        })
        .catch(error => console.log('error', error));
    }catch (error) {
        errorContainer.innerText = error.message
        console.log(error.message)
    }

}

/* DELETE FUNCTIONS */

function launchDeleteValidation(container, nombre){
    if(container == deleteValidationRegion){
        deleteMessageRegion.innerHTML = `¿Desea eliminar a ${nombre} de su lista de regiones? También se eliminarán países, ciudades, compañias y contactos que se encuentren allí.`
    }else if(container == deleteValidationPais){
        deleteMessagePais.innerHTML = `¿Desea eliminar a ${nombre} de su lista de países? También se eliminarán las ciudades, compañias y contactos que se encuentren allí.`
    }else if(container == deleteValidationCiudad){
        deleteMessageCiudad.innerHTML = `¿Desea eliminar a ${nombre} de su lista de ciudades? También se eliminarán las compañias y contactos que se encuentren allí.`
    }

    if(popUpBkg.classList.contains("opacityInverseAnim")){
        popUpBkg.classList.replace("opacityInverseAnim","opacityAnim")
    }else{
        popUpBkg.classList.add("opacityAnim")
    }
    setTimeout(()=>{
        popUpBkg.style.display = "flex"
        container.style.display = "flex"
    }, 300)
}

function deleteLocation(locationType){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem("token"));

    var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch(`http://localhost:3000/${locationType}/${idSelected}`, requestOptions)
    .then((response) => {return response})
        .then((result) => {
            if(result.status == 200){
                errorContainer.forEach(container=>{
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
                    errorContainer.forEach(container=>{
                        if(res.error){
                            container.innerText = res.error
                        }else{
                            container.innerText = res
                        }
                    })
                })
            }
        })
        .catch(error => console.log('error', error));
}

deleteButtonRegion.addEventListener("click", ()=>{
    deleteLocation("regiones")
})
deleteButtonPais.addEventListener("click", ()=>{
    deleteLocation("paises")
})
deleteButtonCiudad.addEventListener("click", ()=>{
    deleteLocation("ciudades")
})


