let allProductos = [];
let currentEditId = null;

// Inicialización
function loadProductosPage() {
    loadProductos();
    setupImageListeners();
}

// Configurar listeners, etc. (manteniendo la misma lógica)
function setupImageListeners() {
    const createInput = document.getElementById('imagenFile');
    if(createInput) {
        createInput.addEventListener('change', function(e) {
            handleFileSelect(e, 'imagenBase64');
        });
    }
    
    const editInput = document.getElementById('editImagenFileInput');
    if(editInput) {
        editInput.addEventListener('change', function(e) {
            handleFileSelect(e, 'editImagenFinal', 'editImgPreview');
        });
    }
}

// Convertir Archivo a Base64
function handleFileSelect(event, hiddenInputId, previewImgId = null) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64String = e.target.result;
            document.getElementById(hiddenInputId).value = base64String;
            if(previewImgId) document.getElementById(previewImgId).src = base64String;
        };
        reader.readAsDataURL(file);
    }
}

// Alternar entre URL y Archivo
function toggleImageInput(context, type) {
    const urlInput = document.getElementById(context === 'create' ? 'imagen' : 'editImagenUrlInput');
    const fileInput = document.getElementById(context === 'create' ? 'imagenFile' : 'editImagenFileInput');
    
    if (type === 'url') {
        urlInput.style.display = 'block';
        fileInput.style.display = 'none';
    } else {
        urlInput.style.display = 'none';
        fileInput.style.display = 'block';
    }
}

// 📌 Mapeo de Proveedor 
function getProveedorName(id) {
    if (!id || parseInt(id) === 0) return 'N/A';
    
    const idNum = parseInt(id); 
    if (isNaN(idNum)) return 'Desconocido';

    switch(idNum) {
        case 1: return 'DormiFlex';
        case 2: return 'OffiTop';
        case 3: return 'CasaHome';
        case 4: return 'MaderaVira';
        default: return 'Desconocido'; 
    }
}

// 📌 Mapeo de Categoría 
function getCategoriaName(id) {
    if (!id || parseInt(id) === 0) return 'N/A';
    
    const idNum = parseInt(id); 
    if (isNaN(idNum)) return 'Desconocido';

    switch(idNum) {
        case 1: return 'Camas';
        case 2: return 'Mesas';
        case 3: return 'Sillas';
        case 4: return 'Estantes';
        default: return 'Desconocido';
    }
}

// --- CARGA DE DATOS CON LOADER (CORRECCIÓN API) ---
async function loadProductos() {
    const grid = document.getElementById('productosGrid');
    const countHeader = document.getElementById('productCountHeader');

    // MOSTRAR LOADER INMEDIATAMENTE
    grid.innerHTML = `
        <div style="grid-column: 1/-1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; color: #666; height: 100%;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2.5rem; margin-bottom: 1rem; color: #0d6efd;"></i>
            <p style="font-size: 1.1rem; font-weight: 500;">Cargando catálogo...</p>
        </div>
    `;
    countHeader.innerHTML = ''; 

    try {
        // 🚨 CORRECCIÓN: USAMOS LA RUTA RELATIVA '/api/productos' en lugar de localhost
        const response = await fetch('/api/productos'); 
        if (!response.ok) throw new Error('Error al conectar con la API del servidor');
        
        const data = await response.json();
        allProductos = data;
        
        filterProducts(); 

    } catch (error) {
        console.error('❌ Error:', error);
        allProductos = []; 
        
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #dc3545;">
                <i class="fas fa-exclamation-circle" style="font-size: 2.5rem; margin-bottom: 1rem;"></i>
                <p style="font-size: 1.2rem;">No se pudo cargar el inventario. (Error de API)</p>
                <button onclick="loadProductos()" class="btn btn-secondary" style="margin-top:1rem; cursor: pointer;">
                    <i class="fas fa-sync"></i> Reintentar
                </button>
            </div>
        `;
        countHeader.innerHTML = '<span style="color: red">Error de conexión</span>';
    }
}

// --- LÓGICA VISUAL Y FILTROS ---
function toggleFilters() {
    const container = document.getElementById('filterContainer');
    container.style.display = (container.style.display === 'none' || container.style.display === '') ? 'flex' : 'none';
}

function renderProductos(productos) {
    const grid = document.getElementById('productosGrid');
    const countHeader = document.getElementById('productCountHeader');
    
    countHeader.innerHTML = `Mostrando ${productos.length} productos`;

    if (productos.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #666; font-style: italic;">No se encontraron productos con esos filtros.</p>';
        return;
    }

    grid.innerHTML = productos.map(p => {
        let imageContent;
        if (p.imagen && p.imagen.trim() !== "") {
            imageContent = `<img src="${p.imagen}" alt="${p.nombre}">`;
        } else {
            const shortTitle = p.nombre ? p.nombre.split(' ').slice(0, 2).join(' ') : 'Producto';
            imageContent = `<div class="placeholder-text">${shortTitle}</div>`;
        }

        const idProveedor = p.id_proveedor; 
        const proveedorDisplay = getProveedorName(idProveedor) || 'N/A';
        
        return `
        <div class="product-card" onclick="openProductDetail(${p.id})">
            <div class="card-image-area">${imageContent}</div>
            <div class="card-content">
                <div class="card-meta-top">
                    <span class="card-brand">${proveedorDisplay}</span> <span class="card-sku">SKU: ${p.sku}</span>
                </div>
                <h3 class="card-title">${p.nombre}</h3>
                <div class="card-meta-bottom">
                    <span class="card-stock">Stock: ${p.stock}</span>
                    <span class="card-price">S/ ${parseFloat(p.precio).toFixed(2)}</span>
                </div>
            </div>
        </div>`;
    }).join('');
}

function filterProducts() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const proveedorID = document.getElementById('proveedorFilter').value; 
    const categoriaID = document.getElementById('categoriaFilter').value; 
    const sort = document.getElementById('sortFilter').value;

    let filtered = allProductos.filter(p => {
        const pNombre = p.nombre ? p.nombre.toLowerCase() : '';
        const pSku = p.sku ? p.sku.toLowerCase() : '';
        
        // 1. Búsqueda por texto (nombre o SKU)
        const matchSearch = !search || pNombre.includes(search) || pSku.includes(search);
        
        // 2. Filtro Proveedor
        const matchProveedor = !proveedorID || (p.id_proveedor == proveedorID);
        
        // 3. Filtro Categoría
        const matchCategoria = !categoriaID || (p.categoria_id == categoriaID); 
        
        return matchSearch && matchProveedor && matchCategoria;
    });

    // Ordenamiento
    if (sort === 'price-asc') filtered.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
    if (sort === 'price-desc') filtered.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
    if (sort === 'stock-asc') filtered.sort((a, b) => a.stock - b.stock);
    if (sort === 'stock-desc') filtered.sort((a, b) => b.stock - a.stock);
    if (sort === 'name-asc') filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
    if (sort === 'name-desc') filtered.sort((a, b) => b.nombre.localeCompare(a.nombre));

    renderProductos(filtered);
}

// --- CRUD functions (CORRECCIÓN API) ---

function showProductForm() {
    document.getElementById('formContainer').style.display = 'flex';
    document.getElementById('addProductForm').reset();
    document.getElementById('imagenBase64').value = ""; 
}

function hideProductForm() {
    document.getElementById('formContainer').style.display = 'none';
}

async function handleProductSubmit(event) {
    event.preventDefault();
    
    const imgType = document.querySelector('input[name="imgSourceType"]:checked').value;
    let finalImage = "";
    
    if (imgType === 'url') {
        finalImage = document.getElementById('imagen').value;
    } else {
        finalImage = document.getElementById('imagenBase64').value;
    }

    const producto = {
        nombre: document.getElementById('nombre').value,
        sku: document.getElementById('sku').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value),
        stock_minimo: parseInt(document.getElementById('stockMinimo').value),
        id_categoria: parseInt(document.getElementById('id_categoria').value),
        id_proveedor: parseInt(document.getElementById('id_proveedor').value), // Correcto
        descripcion: document.getElementById('descripcion').value,
        imagen: finalImage
    };

    try {
        // 🚨 CORRECCIÓN: USAMOS RUTA RELATIVA
        const response = await fetch('/api/productos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });
        if (response.ok) {
            alert('Producto creado');
            hideProductForm();
            loadProductos();
        } else { alert("Error al guardar"); }
    } catch (error) { console.error(error); }
}

function openProductDetail(id) {
    const p = allProductos.find(prod => prod.id === id);
    if (!p) return;
    currentEditId = id;

    // Llenar campos
    document.getElementById('detalleTitulo').textContent = p.nombre;
    document.getElementById('editNombre').value = p.nombre;
    document.getElementById('editSku').value = p.sku;
    document.getElementById('editPrecio').value = p.precio;
    document.getElementById('editStock').value = p.stock;
    document.getElementById('editStockMin').value = p.stock_minimo || 5;
    document.getElementById('editDescripcion').value = p.descripcion || '';
    
    // Usamos las propiedades correctas del objeto de producto: p.categoria_id y p.id_proveedor
    if(p.categoria_id) document.getElementById('editCategoria').value = p.categoria_id;
    if(p.id_proveedor) document.getElementById('editProveedor').value = p.id_proveedor;

    // Imagen
    const currentImg = p.imagen || '';
    document.getElementById('editImagenFinal').value = currentImg;
    document.getElementById('editImagenUrlInput').value = currentImg.startsWith('data:') ? '' : currentImg;
    document.getElementById('editImgPreview').src = currentImg || 'https://placehold.co/100x100?text=Sin+Img';

    setEditMode(false);
    document.getElementById('modalDetalle').style.display = 'flex';
}

function closeDetalle() {
    document.getElementById('modalDetalle').style.display = 'none';
}

function enableEditMode() {
    setEditMode(true);
}

function cancelEditMode() {
    setEditMode(false);
    openProductDetail(currentEditId); 
}

function setEditMode(isEditing) {
    const inputs = document.querySelectorAll('.detail-input');
    inputs.forEach(input => {
        if (input.id !== 'editStock') { 
            input.disabled = !isEditing;
        }
    });

    document.getElementById('viewButtons').style.display = isEditing ? 'none' : 'flex';
    document.getElementById('editButtons').style.display = isEditing ? 'flex' : 'none';
    document.getElementById('editImageControls').style.display = isEditing ? 'flex' : 'none';
}

async function handleUpdate(e) {
    e.preventDefault();
    
    const imgType = document.querySelector('input[name="editImgSourceType"]:checked').value;
    let finalImg = document.getElementById('editImagenFinal').value;
    
    if (imgType === 'url') {
        const urlVal = document.getElementById('editImagenUrlInput').value;
        if(urlVal) finalImg = urlVal;
    }

    const data = {
        nombre: document.getElementById('editNombre').value,
        sku: document.getElementById('editSku').value,
        id_categoria: parseInt(document.getElementById('editCategoria').value),
        id_proveedor: parseInt(document.getElementById('editProveedor').value), // Correcto
        precio: parseFloat(document.getElementById('editPrecio').value),
        stock: parseInt(document.getElementById('editStock').value), 
        stock_minimo: parseInt(document.getElementById('editStockMin').value),
        descripcion: document.getElementById('editDescripcion').value,
        imagen: finalImage
    };

    try {
        // 🚨 CORRECCIÓN: USAMOS RUTA RELATIVA
        const res = await fetch(`/api/productos/${currentEditId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            alert("Actualizado correctamente");
            closeDetalle();
            loadProductos();
        } else { alert("Error al actualizar"); }
    } catch (error) { console.error(error); }
}

async function deleteFromModal() {
    if(!confirm("¿Estás seguro? Esta acción no se puede deshacer.")) return;
    try {
        // 🚨 CORRECCIÓN: USAMOS RUTA RELATIVA
        const res = await fetch(`/api/productos/${currentEditId}`, { method: 'DELETE' });
        if (res.ok) {
            alert("Eliminado");
            closeDetalle();
            loadProductos();
        }
    } catch (error) { console.error(error); }
}