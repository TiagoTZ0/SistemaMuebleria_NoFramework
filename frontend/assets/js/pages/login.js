// Simulación: Mapeo de Rol -> Usuario Específico
const identities = {
    'Admin': { name: 'Bruno', email: 'bruno@mail.com' },
    'Vendedor': { name: 'Carlos', email: 'carlos@mail.com' },
    'Despachador': { name: 'Jhon', email: 'jhon@mail.com' }
};

function handleLogin(event) {
    event.preventDefault();
    
    const roleSelect = document.getElementById('role');
    const selectedRole = roleSelect.value;
    const usernameTyped = document.getElementById('username').value;
    const passwordTyped = document.getElementById('password').value;
    
    if (!selectedRole) {
        alert("Por favor seleccione un rol.");
        return;
    }
    if (!usernameTyped || !passwordTyped) {
        alert("Por favor complete usuario y contraseña.");
        return;
    }

    // SIMULACIÓN: Login exitoso forzando la identidad del rol
    const identity = identities[selectedRole];
    
    const user = { 
        username: identity.name, 
        email: identity.email,
        role: selectedRole 
    };

    localStorage.setItem('user', JSON.stringify(user));
    window.location.reload();
}
