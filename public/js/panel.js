const priceInput = document.getElementById("new-price");
priceInput.addEventListener("input", (event) => {
    let value = event.target.value.replace(/\D/g, "");
    value = value.match(/.{1,3}/g)?.join(", ") || "";
    event.target.value = value;
});


const sidebarButtons = document.querySelectorAll("main aside button");
for (let i = 0; i < sidebarButtons.length; i++ ) {
    const section = document.querySelectorAll(".action-view-board section");
    sidebarButtons[i].addEventListener("click", (event) => {
        section.forEach((sec) => {
            sec.style.display = "none";
        });
        section[i].style.display = "block";
    });
};
