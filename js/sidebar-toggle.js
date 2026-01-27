const hamburger = document.querySelector("#toggle-btn");

hamburger.addEventListener("click", (event) => {
    document.querySelector("#sidebar").classList.toggle("expand")
});