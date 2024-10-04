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
  if (json.error) {
    alert(json.error);
    return;
  };

  document.getElementById("logout-modal").style.display = "none";
  alert(json.message);
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

  // location.href = "/";


    // submitMessage.textContent = 'Login successfully'
    // loadRole();

  // async function submitLogout(event) {
  //   event.preventDefault()
  //   let form = event.target
  //   let submitMessage = form.querySelector('.message')
  //   let res = await fetch(form.action, {
  //     method: form.method,
  //     headers: {
  //       Accept: 'application/json',
  //     },
  //   })
  //   let json = await res.json()
  //   if (json.error) {
  //     submitMessage.textContent = json.error
  //     return
  //   }
  //   submitMessage.textContent = 'Logout successfully'
  //   loadRole()
  // }

  // async function loadRole() {
  //   let res = await fetch('/role')
  //   let json = await res.json()
  //   loginForm.hidden = json.role != 'guest'
  //   logoutForm.hidden = json.role == 'guest'
  //   // document.body.setAttribute('data-role', json.role)
  //   document.body.dataset.role = json.role
  //   if (json.role == 'user') {
  //     logoutForm.querySelector('.username').textContent = json.username
  //   }
  // }
  // loadRole();

  // userRouter.get("/userinfo.js", async (req, res, next) => {
  //   if (req.session.username) {
  //     res.write("let userinfo = ");
  //     if (!req.session.username) {
  //       res.write("{}");
  //     } else {
  //       res.write(JSON.stringify({ username: req.session.username, userrole: formatRole(req.session.role) }));
  //     }
  //   } else {
  //     res.write("location.href = '/login.html'");
  //   }
  //   res.end();
  // });

  // function formatRole(role: string) {
  //   switch (role) {
  //     case "admin":
  //       return "Administrator";
  //     case "cfu":
  //       return "Technician";
  //     case "user":
  //       return "Department";
  //   }
  //   return "unknown";
  // }