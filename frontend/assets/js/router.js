/* Router Simple */
const pages = {
    'home': 'pages/home.html',
    'productos': 'pages/productos.html',
    'clientes': 'pages/clientes.html',
    'pedidos': 'pages/pedidos.html',
    'reportes': 'pages/reportes.html',
    'admin': 'pages/admin.html',
    'login': 'pages/login.html',
    'register': 'pages/register.html'
};

async function loadPage(page) {
    if (!pages[page]) {
        console.error(`Page not found: ${page}`);
        return;
    }

    // Si es login/register y ya existe usuario, cargar home
    if ((page === 'login' || page === 'register') && app.currentUser) {
        page = 'home';
    }

    // Si no es login/register y no hay usuario, cargar login
    if (page !== 'login' && page !== 'register' && !app.currentUser) {
        page = 'login';
    }

    try {
        const response = await fetch(pages[page]);
        const html = await response.text();
        document.getElementById('contentArea').innerHTML = html;

        setActiveNav(page);

        // Ejecutar script específico de la página
        const scriptFunction = window[`load${capitalize(page)}Page`];
        if (scriptFunction) {
            scriptFunction();
        }
    } catch (error) {
        console.error(`Error loading page ${page}:`, error);
        showAlert(`Error cargando página: ${page}`, 'danger');
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
