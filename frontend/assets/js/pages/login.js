function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Mock authentication
    if (username && password && role) {
        const user = {
            id: 1,
            name: username,
            role: role,
            email: `${username}@gmail.com`
        };

        app.setCurrentUser(user);
        showAuthUI();
        navigateTo('home');
        showAlert(`¡Bienvenido ${username}!`, 'success');
    } else {
        showAlert('Por favor completa todos los campos', 'danger');
    }
}

function switchToRegister() {
    navigateTo('register');
}

function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('regPasswordConfirm').value;

    if (!username || !email || !password || !passwordConfirm) {
        showAlert('Por favor completa todos los campos', 'danger');
        return;
    }

    if (password !== passwordConfirm) {
        showAlert('Las contraseñas no coinciden', 'danger');
        return;
    }

    // Crear usuario
    const user = {
        id: Math.floor(Math.random() * 1000),
        name: username,
        email: email,
        role: 'Vendedor'
    };

    app.setCurrentUser(user);
    showAuthUI();
    navigateTo('home');
    showAlert(`¡Bienvenido ${username}! Tu cuenta ha sido creada`, 'success');
}

function switchToLogin() {
    navigateTo('login');
}
