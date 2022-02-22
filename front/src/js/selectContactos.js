let contactsId;
let checkColumn = document.querySelectorAll(".checkColumn")

//CHECK TODOS LOS CONTACTOS
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

deleteSelectionButton.addEventListener("click", ()=>{
    checkColumn = document.querySelectorAll(".checkColumn")

    let checkChildren = [...checkColumn].filter(check=>{
        if(!check.classList.contains("columnTitle") 
            && check.firstElementChild.checked){
            return check
        }
    })

    contactsId = checkChildren.map((div)=>{
        return parseInt(div.firstElementChild.attributes.contactid.value)
    })

    if(popUpBkg.classList.contains("opacityInverseAnim")){
        popUpBkg.classList.replace("opacityInverseAnim","opacityAnim")
    }else{
        popUpBkg.classList.add("opacityAnim")
    }
    
    popUpBkg.style.display = "flex"
    deleteSelectionValidation.style.display = "flex"
    deleteSelectionMessage.innerText = 
    `¿Desea eliminar los ${contactsId.length} contactos seleccionados?`
    
})

confirmSelectionButton.addEventListener("click", ()=>{
    var myHeaders = new Headers();
    myHeaders.append("Authorization", localStorage.getItem("token"));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
    "contactsId": contactsId
    });

    var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    fetch("http://localhost:3000/contactos/", requestOptions)
    .then((response) => {return response})
    .then((result) => result.json().then((res)=>{
        popUpBkg.classList.add("opacityInverseAnim")
        setTimeout(()=>{
            popUpBkg.style.display = "none"
            deleteSelectionValidation.style.display = "none"
        }, 300)

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
})

function updateSelectionButton(){
    let checkChildren = [...checkColumn].filter(check=>{
        if(!check.classList.contains("columnTitle") 
            && check.firstElementChild.checked){
            return check
        }
    })

    if(checkChildren.length == 0){
        deleteSelectionButton.classList.add("opacityInverseAnim")
        deleteSelectionButton.style.display = "none"
    }else{
        deleteSelectionButton.style.display = "flex"
        if(deleteSelectionButton.classList.contains("opacityInverseAnim")){
            deleteSelectionButton.classList.replace("opacityInverseAnim","opacityAnim")
        }else{
            deleteSelectionButton.classList.add("opacityAnim")
        }
        deleteSelectionButtonP = document.querySelector("#deleteSelectionButton p")
        deleteSelectionButtonP.innerText = `${checkChildren.length} contactos seleccionados`
    }
}