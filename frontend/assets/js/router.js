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

window.navigateTo = async function(page) {
    await loadPage(page);
}

async function loadPage(page) {
    const user = localStorage.getItem('user');
    
    // Lista de páginas PÚBLICAS que no requieren autenticación (Login y Register)
    const publicPages = ['login', 'register'];

    // 1. Protección de Rutas: Si no hay usuario, forzar a Login, A MENOS que intente ir a Register.
    if (!publicPages.includes(page) && !user) {
        page = 'login'; 
    }
    
    // 2. Si hay usuario y quiere ir a login o register, mandarlo a Home.
    if (publicPages.includes(page) && user) {
        page = 'home';  
    }

    try {
        const response = await fetch(pages[page]);
        if (!response.ok) throw new Error("Error al cargar pagina");
        const html = await response.text();
        
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = html;

        // Manejo de la UI (Ocultar barras en páginas públicas)
        if (publicPages.includes(page)) {
            document.getElementById('sidebar').style.display = 'none';
            document.getElementById('header').style.display = 'none';
        } else {
            // Asegurar que se vean si ya entró
            document.getElementById('sidebar').style.display = 'flex';
            document.getElementById('header').style.display = 'flex';
            setActiveNav(page);
        }

        // Ejecutar scripts incrustados en el HTML cargado
        executeScripts(contentArea);

        // Ejecutar inicializadores globales (ej: loadProductosPage)
        const scriptName = `load${capitalize(page)}Page`;
        if (typeof window[scriptName] === 'function') {
            window[scriptName]();
        }

    } catch (error) {
        console.error(error);
    }
}

// Función vital para que funcionen los scripts dentro de las páginas cargadas
function executeScripts(container) {
    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        if (oldScript.src) {
            newScript.src = oldScript.src;
        } else {
            newScript.textContent = oldScript.textContent;
        }
        document.body.appendChild(newScript);
        document.body.removeChild(newScript);
    });
}

function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

function setActiveNav(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`'${page}'`)) {
            link.classList.add('active');
        }
    });
}