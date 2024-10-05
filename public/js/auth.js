const Swal = window.Swal;

document.getElementById("login-form").addEventListener("submit", submitLogin);
document.getElementById("logout-form").addEventListener("submit", submitLogout);

async function submitLogin(event) {
  event.preventDefault();

  let form = event.target;

  // let submitMessage = form.querySelector('.message')

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
    alert(json.error);
    // submitMessage.textContent = json.error
    return;
  };

  document.getElementById("login-modal").style.display = "none";

  Swal.fire({
    position: "center",
    icon: "success",
    title: json.success,
    showConfirmButton: false,
    timer: 2500
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
    timer: 2500
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
  } else {
    document.getElementById("login-btn").style.display = "inline-block";
    document.getElementById("user-info").style.display = "none";
  };
};

loadVisitorRole();


// window.addEventListener("load", function(){
//   alert("Welcome to Impetus Watch Store!");
//   console.log("Welcome to Impetus Watch Store!");

// Swal.fire({
// title: "Good job!",
// text: "You clicked the button!",
// icon: "success"
// })
// });
