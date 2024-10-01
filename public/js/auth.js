




async function submitLogin(event) {
    console.log('submit login with ajax...')
    event.preventDefault()
    let form = event.target
    let submitMessage = form.querySelector('.message')
    let res = await fetch(form.action, {
      method: form.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: form.username.value,
        password: form.password.value,
      }),
    })
    // console.log('res:', res)
    let json = await res.json()
    if (json.error) {
      submitMessage.textContent = json.error
      return
    }
    submitMessage.textContent = 'Login successfully'
    loadRole()
  }

  async function submitLogout(event) {
    console.log('submit logout with ajax...')
    event.preventDefault()
    let form = event.target
    let submitMessage = form.querySelector('.message')
    let res = await fetch(form.action, {
      method: form.method,
      headers: {
        Accept: 'application/json',
      },
    })
    let json = await res.json()
    if (json.error) {
      submitMessage.textContent = json.error
      return
    }
    submitMessage.textContent = 'Logout successfully'
    loadRole()
  }

  async function loadRole() {
    let res = await fetch('/role')
    let json = await res.json()
    loginForm.hidden = json.role != 'guest'
    logoutForm.hidden = json.role == 'guest'
    // document.body.setAttribute('data-role', json.role)
    document.body.dataset.role = json.role
    if (json.role == 'user') {
      logoutForm.querySelector('.username').textContent = json.username
    }
  }
  loadRole()
