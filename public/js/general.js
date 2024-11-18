const Swal = window.Swal;

// @ global error handler to listen for unhandled fetch errors:
window.addEventListener("unhandledrejection", event => {
    console.error('Unhandled promise rejection:', event.reason);
    window.location.href = "/404.html";
    });



// @ navbar toggle
let navList = document.getElementById("navList");
let toggleBtn = document.getElementById("toggleBtn");

toggleBtn.addEventListener("click", () => {
    navList.classList.toggle("show");
});


// @ scroll down effect
const header = document.querySelector("header");
const scrollWatcher = document.createElement("div");

scrollWatcher.setAttribute("data-scroll-watcher", "");
header.before(scrollWatcher);

const navObserver = new IntersectionObserver((entries) => {
    // console.log(entries);
    header.classList.toggle("scroll-down", !entries[0].isIntersecting)
}, {rootMargin: "200px 0px 0px 0px"});

navObserver.observe(scrollWatcher);

// @ login popup
const loginBtn = document.getElementById("login-btn");
const loginModal = document.getElementById("login-modal");

loginBtn.onclick = () => {
    loginModal.style.display = "block";
    document.querySelector("#login-form .input-box input").focus();
};

const closeBtn = document.getElementById("close");

closeBtn.onclick = () => {
    loginModal.style.display = "none";
};

// @ toggle for login-register
const shiftToRegisterBtn = document.getElementById("register-link");
const shiftToLoginBtn = document.getElementById("login-link");
const modalStatus = document.querySelector(".modal-content");

shiftToRegisterBtn.addEventListener("click", () => {
    modalStatus.classList.toggle("active");
});

shiftToLoginBtn.addEventListener("click", () => {
    modalStatus.classList.toggle("active");
});

// @ toggle the hidden element if user clicks on user-info
document.getElementById("user-info").addEventListener("click", function() {
    document.getElementById("user-action").toggleAttribute("hidden");
});
// @ link appended to "profile" button is coded in auth.js

// @ logout popup
const logoutBtn = document.getElementById("logout-btn");
const logoutModal = document.getElementById("logout-modal");
logoutBtn.addEventListener("click", () => {
    logoutModal.style.display = "block";
});

const cancelLogout = document.getElementById("cancel-logout");
cancelLogout.onclick = () => {
    logoutModal.style.display = "none";
}


const buyFormModal = document.getElementById("buy-modal");

// @ close modal by clicking outside
window.onclick = function (event) {
    if (event.target === loginModal) {
        loginModal.style.display = "none";
    } if (event.target === logoutModal) {
        logoutModal.style.display = "none";
    } else if (event.target === buyFormModal) {
        buyFormModal.style.display = "none";
    }
};


// const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const monthRef = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
];
// @ parse Date object from database to readable format
var formatDate = function (dateToBeFormatted) {
    let date = new Date(dateToBeFormatted);

    let dateOfMon = ("0" + date.getDate()).slice(-2);
    let monthIndex = date.getMonth();
    let hr = ("0" + date.getHours()).slice(-2);
    let min = ("0" + date.getMinutes()).slice(-2);
    let sec = ("0" + date.getSeconds()).slice(-2);
    return `${dateOfMon} ${
      monthRef[monthIndex]
    } ${date.getFullYear()} ${hr}:${min}:${sec}`;
}

var refThisMonth = monthRef[new Date().getMonth()];

// @ popup message box reused
var msgFailure = function (txtMsg) {
    Swal.fire({
        position: "center",
        icon: "error",
        title: txtMsg,
        showConfirmButton: true,
    });
}

var msgSuccess = function (txtMsg) {
    Swal.fire({
        position: "center",
        icon: "success",
        title: txtMsg,
        showConfirmButton: false,
      });
}

var swalMsgBox = Swal.mixin({
    customClass: {
        popup: "swal-update-success-msg",
        title: "swal-update-success-msg",
        confirmButton: "swal-btn",
        cancelButton: "swal-btn",
        footer: "swal-update-time",
    },
});


