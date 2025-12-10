const API_URL = '/api';

class App {
    constructor() {
        this.currentUser = null;
        this.loadUserFromStorage();
    }

    loadUserFromStorage() {
        const user = localStorage.getItem('user');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.updateUI();
        }
    }

    updateUI() {
        const userNameEl = document.getElementById('userName');
        const adminLink = document.getElementById('adminLink');

        if (this.currentUser) {
            userNameEl.textContent = `${this.currentUser.name} (${this.currentUser.role})`;
            if (this.currentUser.role === 'Admin') {
                adminLink.style.display = 'block';
            }
        }
    }

    checkAuth() {
        return this.currentUser !== null;
    }

    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
        this.updateUI();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('user');
        hideAuthUI();
        navigateTo('login');
    }
}

const app = new App();

function navigateTo(page) {
    loadPage(page);
}

function logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        app.logout();
    }
}

async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showAlert(`Error: ${error.message}`, 'danger');
        throw error;
    }
}

function showAlert(message, type = 'info') {
    const container = document.getElementById('alerts-container') || document.body;
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 9999;
        max-width: 400px;
    `;
    container.appendChild(alert);

    setTimeout(() => alert.remove(), 5000);
}

function setActiveNav(page) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = Array.from(document.querySelectorAll('.nav-link')).find(
        link => link.textContent.toLowerCase().includes(page.toLowerCase())
    );

    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function showAuthUI() {
    document.getElementById('sidebar').style.display = 'block';
    document.getElementById('header').style.display = 'flex';
}

function hideAuthUI() {
    document.getElementById('sidebar').style.display = 'none';
    document.getElementById('header').style.display = 'none';
}
