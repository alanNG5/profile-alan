const Swal = window.Swal;
var urlCurrent = "https://impetus-go.me/";
urlCurrent = "http://localhost:8900/";

let loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", submitLogin);
document.getElementById("logout-form").addEventListener("submit", submitLogout);
document.getElementById("register-form").addEventListener("submit", submitRegister);

async function submitLogin(event) {
  event.preventDefault();

  let form = event.target;

  let res = await fetch(form.action, {
      method: form.method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username: form.username.value,
        password: form.password.value,
      }),
    });

  let json = await res.json();

  if (json.error) {

    Swal.fire({
      position: "center",
      icon: "error",
      title: json.error,
      text: "Please try again.",
      showConfirmButton: true,
    });

    loginForm.reset();

    return;
  };

  document.getElementById("login-modal").style.display = "none";

  Swal.fire({
    position: "center",
    icon: "success",
    title: json.success,
    showConfirmButton: false,
    timer: 2000
  });

  loadVisitorRole();
};

async function submitLogout(event) {
  event.preventDefault();
  event.stopPropagation();

  let form = event.target;

  let res = await fetch(form.action, {
    method: form.method,
    headers: {
      Accept: 'application/json',
    },
    });

  let json = await res.json();
  if (json.logoutError) {
    alert(json.logoutError);
    return;
  };

  document.getElementById("logout-modal").style.display = "none";

  Swal.fire({
    position: "center",
    icon: "success",
    title: json.logoutMessage,
    showConfirmButton: false,
    timer: 2000
  }).then(() => {
    if (location.href === `${urlCurrent}purchase_record.html`) {
    location.href = "/watch_main.html";
    } else if (location.href === `${urlCurrent}admin.html`) {
      location.href = "/watch_main.html";
    };
  });

  loadVisitorRole();
};


async function submitRegister(event) {
  event.preventDefault();

  let form = event.target;

  let res = await fetch(form.action, {
    method: form.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: form.username.value,
      email: form.email.value,
      password: form.password.value,
    }),
  });

  let json = await res.json();

  if(json.error) {

    Swal.fire({
      position: "center",
      icon: "error",
      title: json.error,
      showConfirmButton: true,
    });

  return;
  };

  document.getElementById("login-modal").style.display = "none";

  Swal.fire({
    position: "center",
    icon: "success",
    title: json.success,
    showConfirmButton: false,
    timer: 2000
  });

  loadVisitorRole();
};


async function loadVisitorRole () {

  let res = await fetch("/user");
  let json = await res.json();

  if (json.visitor != "guest") {

    document.getElementById("login-btn").style.display = "none";

    document.getElementById("user-info").style.display = "flex";
    document.getElementById("role-info").textContent = json.visitor;
    document.getElementById("name-info").textContent = json.username;

    let panelBtn = document.getElementById("panel-btn");
    panelBtn.textContent = json.visitor === "member" ? "Profile" : "Admin Panel";
    panelBtn.onclick = json.visitor === "member" ? () => {
      location.href = "/purchase_record.html";
    } : () => {
      window.location.href = "/admin.html";
    };

  } else {
    document.getElementById("login-btn").style.display = "inline-block";
    document.getElementById("user-info").style.display = "none";
  };
};

loadVisitorRole();