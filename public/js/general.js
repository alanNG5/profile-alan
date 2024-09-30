// navbar toggle
let navList = document.getElementById("navList");
let toggleBtn = document.getElementById("toggleBtn");

toggleBtn.addEventListener("click", () => {
    navList.classList.toggle("show");
});

// login popup
const loginBtn = document.getElementById("login-btn");
const loginModal = document.getElementById("login-modal");

loginBtn.onclick = () => {
    loginModal.style.display = "block";
};

const closeBtn = document.getElementById("close");

closeBtn.onclick = () => {
    loginModal.style.display = "none";
    console.log("close");
};

window.onclick = function (event) {
    if (event.target === loginModal) {
        loginModal.style.display = "none";
    };
};

// toggle for login-register
const shiftToRegisterBtn = document.getElementById("register-link");
const shiftToLoginBtn = document.getElementById("login-link");
const modalStatus = document.querySelector(".modal-content");

shiftToRegisterBtn.addEventListener("click", () => {
    modalStatus.classList.toggle("active");
});

shiftToLoginBtn.addEventListener("click", () => {
    modalStatus.classList.toggle("active");
});


const header = document.querySelector("header");
const scrollWatcher = document.createElement("div");

scrollWatcher.setAttribute("data-scroll-watcher", "");
header.before(scrollWatcher);

const navObserver = new IntersectionObserver((entries) => {
    header.classList.toggle("scroll-down", !entries[0].isIntersecting)
}, {rootMargin: "250px 0px 0px 0px"});

navObserver.observe(scrollWatcher);
