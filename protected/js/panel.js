const priceInput = document.getElementById("new-price");
const priceUpdate = document.getElementById("result-price");

function formatDollarInput (element) {
    element.addEventListener("input", (event) => {
        let value = event.target.value.replace(/\D/g, "");
        if (!isNaN(value) && value.length > 0) {
            value = parseInt(value, 10).toLocaleString("zh-HK");
        } else {
            value = "";
        }
        event.target.value = value;
    });
};

formatDollarInput (priceInput);
formatDollarInput (priceUpdate);

// @ not recommended for for-loop with addEventListener

// const sidebarButtons = document.querySelectorAll("main aside button");
// for (let i = 0; i < sidebarButtons.length; i++ ) {
//     const section = document.querySelectorAll(".action-view-board section");
//     sidebarButtons[i].addEventListener("click", () => {
//         section.forEach((sec) => {
//             sec.style.display = "none";
//         });
//         section[i].style.display = "block";
//     });
// };

// @ addEventListener at parent element
const menu = document.getElementById("aside-menu-btn");
menu.addEventListener("click", (event) => {
    if (event.target.matches("button")) {
        let showSection = event.target.getAttribute("data-index");
        const section = document.querySelectorAll(".action-view-board section");

        section.forEach((sec) => {
            sec.hidden = true;
        });
        section[showSection].hidden = false;
    };
});
