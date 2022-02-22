const logoutButton = document.querySelector(".logoutButton")

logoutButton.addEventListener("click",()=>{
    localStorage.clear()
})