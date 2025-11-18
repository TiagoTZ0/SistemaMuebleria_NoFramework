# Sistema de Mueblería G&M - Versión Vanilla (Sin Frameworks)

Este es una simulación completa del Sistema de Mueblería con **HTML/CSS/JavaScript vanilla** (sin frameworks) en el frontend y **Python puro** (sin frameworks como Flask/Django) en el backend.

## Estructura del Proyecto

```
sistemagmnoframework/
├── frontend/               # Aplicación web vanilla
│   ├── index.html         # Página principal
│   ├── pages/             # Páginas HTML
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── home.html
│   │   ├── productos.html
│   │   ├── clientes.html
│   │   ├── pedidos.html
│   │   ├── reportes.html
│   │   └── admin.html
│   └── assets/
│       ├── css/
│       │   └── styles.css
│       └── js/
│           ├── app.js
│           ├── router.js
│           └── pages/
│               ├── login.js
│               └── productos.js
└── backend/               # API REST en Python
    ├── server.py          # Servidor HTTP
    └── data/
        └── productos.json # Base de datos JSON
```

## Requisitos

- **Frontend**: Navegador moderno (Chrome, Firefox, Safari, Edge)
- **Backend**: Python 3.7 o superior

## Instalación y Ejecución

### 1. Iniciar el Backend (Servidor Python)

```bash
# Navegar a la carpeta backend
cd sistemagmnoframework/backend

# Ejecutar el servidor
python server.py
```

El servidor se iniciará en `http://localhost:8000`

### 2. Abrir el Frontend

```bash
# Opción 1: Abrir directamente el archivo HTML en el navegador
# Navega a: sistemagmnoframework/frontend/index.html

# Opción 2: Si tienes Python disponible, usa un servidor web simple:
cd sistemagmnoframework/frontend
python -m http.server 3000
# Luego abre http://localhost:3000
```

## Características Implementadas

### Frontend
- ✅ **Autenticación**: Login y registro de usuarios
- ✅ **Navegación**: Router SPA sin librerías
- ✅ **Interfaz**: Sidebar, header y content area (como Angular)
- ✅ **Gestión de Productos**: CRUD completo (Create, Read, Update, Delete)
- ✅ **Alertas**: Sistema de notificaciones flotantes
- ✅ **LocalStorage**: Almacenamiento de sesión en cliente
- ✅ **Diseño Responsive**: Adapta a diferentes tamaños de pantalla
- ✅ **CSS Variables**: Sistema de temas y colores

### Backend
- ✅ **API REST**: Endpoints CRUD para productos
- ✅ **Base de Datos JSON**: Almacenamiento en archivo local
- ✅ **CORS**: Configurado para solicitudes desde frontend
- ✅ **Validación**: Datos validados en servidor
- ✅ **Logging**: Registro de solicitudes HTTP

## Endpoints de la API

### Productos
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/{id}` - Obtener un producto específico
- `POST /api/productos` - Crear nuevo producto
- `PUT /api/productos/{id}` - Actualizar producto
- `DELETE /api/productos/{id}` - Eliminar producto

## Credenciales de Ejemplo

**Login:**
- Usuario: `admin`
- Contraseña: `cualquier texto`
- Rol: Selecciona Admin o Vendedor

**Registro:**
- Completa el formulario y se creará una cuenta automáticamente

## Tecnologías Utilizadas

### Frontend
- HTML5 (Semántico)
- CSS3 (Variables, Flexbox, Grid)
- JavaScript ES6+
- LocalStorage API
- Fetch API

### Backend
- Python 3
- Módulo `http.server` (librería estándar)
- JSON (para persistencia)
- UUID (generación de IDs)

## Funcionalidades

### Módulo de Productos (Operativo)
- ✅ Ver lista de productos
- ✅ Agregar nuevo producto
- ✅ Eliminar producto
- ⏳ Editar producto (en desarrollo)

### Otros Módulos (Placeholders)
- 📋 Gestión de Clientes
- 📋 Gestión de Pedidos
- 📋 Reportes
- 📋 Gestión de Usuarios

## Notas de Desarrollo

1. **Sin Frameworks**: No se utilizan Angular, React, Vue, Flask, Django, etc.
2. **Datos Persistentes**: Los datos se guardan en `backend/data/productos.json`
3. **Seguridad**: Este es un prototipo educativo, no use en producción
4. **Logs**: El servidor imprime detalles de cada solicitud en la consola
5. **CORS**: Habilitado para permitir solicitudes desde el frontend local

## Solución de Problemas

### "ERR_FAILED: API Error"
- Asegúrate de que el servidor Python está corriendo en `http://localhost:8000`
- Verifica que no hay otro proceso usando el puerto 8000

### "Conexión rechazada"
- Inicia el servidor backend: `python backend/server.py`
- Espera a ver el mensaje: "🚀 Servidor iniciado en http://localhost:8000"

### "Cross-Origin Request Blocked"
- Asegúrate de que el backend tiene CORS habilitado (está configurado por defecto)
- Verifica que la URL de la API es `http://localhost:8000`

## Estructura de Datos - Producto

```json
{
  "id": "prod001",
  "descripcion": "Cama King Size",
  "sku": "CAMA001",
  "codigoBarras": "7501234567890",
  "categoria": "Muebles",
  "marca": "Ensueño",
  "precio": 1777.50,
  "stockMinimo": 5,
  "stockActual": 12,
  "fechaCreacion": "2025-01-01T10:00:00"
}
```

## Comparación con Versión Angular

| Aspecto | Angular | Vanilla |
|--------|---------|---------|
| Framework Frontend | Sí | No |
| Framework Backend | N/A | No |
| Compilación | Vite + TypeScript | Ninguna |
| Tamaño Inicial | ~500KB gzipped | ~50KB |
| Complejidad | Alta | Baja |
| Curva Aprendizaje | Media-Alta | Baja |
| Escalabilidad | Excelente | Limitada |

## Contacto y Soporte

Para reportar bugs o sugerencias, por favor abre un issue en el repositorio.

---

**Creado con ❤️ para aprendizaje y educación**
