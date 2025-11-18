let allProductos = [];

function loadProductosPage() {
    loadProductos();
}

function showProductForm() {
    document.getElementById('productForm').style.display = 'block';
    document.getElementById('form').reset();
    window.scrollTo(0, 0);
}

function hideProductForm() {
    document.getElementById('productForm').style.display = 'none';
}

async function loadProductos() {
    try {
        const data = await fetchAPI('/productos');
        allProductos = data || [];
        renderProductos(allProductos);
    } catch (error) {
        console.error('Error loading productos:', error);
        // Usar mock data si falla la API
        allProductos = [
            { 
                id: 'mock001',
                descripcion: 'Cama King Size',
                sku: 'CAMA001',
                codigoBarras: '7501234567890',
                categoria: 'Muebles',
                marca: 'Ensueño',
                precio: 1777.50,
                stockMinimo: 5,
                stockActual: 12
            },
            { 
                id: 'mock002',
                descripcion: 'Mesa de Comedor',
                sku: 'MESA001',
                codigoBarras: '7501234567891',
                categoria: 'Muebles',
                marca: 'Oasis',
                precio: 899.99,
                stockMinimo: 3,
                stockActual: 8
            }
        ];
        renderProductos(allProductos);
    }
}

function renderProductos(productos) {
    const grid = document.getElementById('productGrid');
    const header = document.getElementById('gridHeader');
    
    if (!productos || productos.length === 0) {
        header.innerHTML = 'No hay productos registrados';
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <path d="M12 9v4"></path><path d="M12 17h.01"></path>
                </svg>
                <p>No se encontraron productos que coincidan con los filtros.</p>
            </div>
        `;
        return;
    }

    // Actualizar header con cantidad
    const totalProductos = allProductos.length;
    if (productos.length === totalProductos) {
        header.innerHTML = `Mostrando ${totalProductos} productos`;
    } else {
        header.innerHTML = `<span class="filter-chip">Mostrando ${productos.length} de ${totalProductos} productos</span>`;
    }

    grid.innerHTML = productos.map(p => `
        <div class="product-card">
            <img 
                class="product-image"
                src="https://placehold.co/400x400/F0F0F0/999?text=${encodeURIComponent(p.descripcion)}"
                alt="${p.descripcion}"
                onerror="this.src='https://placehold.co/400x400/F0F0F0/999?text=Sin+imagen'">
            
            <div class="product-info">
                <div class="info-header">
                    <span class="product-brand">${p.marca}</span>
                    <span class="product-sku">SKU: ${p.sku || '-'}</span>
                </div>
                
                <span class="product-name">${p.descripcion}</span>
                
                <div class="product-footer">
                    <span class="product-stock">Stock: ${p.stockActual}</span>
                    <span class="product-price">S/ ${parseFloat(p.precio).toFixed(2)}</span>
                </div>
                
                <div class="product-actions">
                    <a class="action-link" onclick="editProduct('${p.id}')">Modificar</a>
                    <button class="action-btn delete" onclick="deleteProduct('${p.id}')">🗑</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    const searchTerm = document.getElementById('searchFilter').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortFilter').value;

    // Filtrar
    let filtered = allProductos.filter(p => {
        const matchSearch = !searchTerm || 
            p.descripcion.toLowerCase().includes(searchTerm) ||
            p.sku.toLowerCase().includes(searchTerm) ||
            p.marca.toLowerCase().includes(searchTerm);
        
        const matchCategory = !category || p.categoria === category;
        
        return matchSearch && matchCategory;
    });

    // Ordenar
    switch(sortBy) {
        case 'nombre_asc':
            filtered.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
            break;
        case 'nombre_desc':
            filtered.sort((a, b) => b.descripcion.localeCompare(a.descripcion));
            break;
        case 'precio_asc':
            filtered.sort((a, b) => a.precio - b.precio);
            break;
        case 'precio_desc':
            filtered.sort((a, b) => b.precio - a.precio);
            break;
        case 'stock_asc':
            filtered.sort((a, b) => a.stockActual - b.stockActual);
            break;
        case 'stock_desc':
            filtered.sort((a, b) => b.stockActual - a.stockActual);
            break;
    }

    renderProductos(filtered);
}

async function handleProductSubmit(event) {
    event.preventDefault();

    const producto = {
        descripcion: document.getElementById('descripcion').value,
        sku: document.getElementById('sku').value,
        codigoBarras: document.getElementById('codigoBarras').value,
        categoria: document.getElementById('categoria').value,
        marca: document.getElementById('marca').value,
        precio: parseFloat(document.getElementById('precio').value),
        stockMinimo: parseInt(document.getElementById('stockMinimo').value),
        stockActual: parseInt(document.getElementById('stockActual').value)
    };

    // Validar campos requeridos
    if (!producto.descripcion || !producto.categoria || !producto.marca || !producto.precio) {
        showAlert('Por favor completa todos los campos requeridos', 'danger');
        return;
    }

    try {
        await fetchAPI('/productos', {
            method: 'POST',
            body: JSON.stringify(producto)
        });
        
        showAlert('✓ Producto guardado correctamente', 'success');
        hideProductForm();
        loadProductos();
    } catch (error) {
        console.error('Error saving producto:', error);
        showAlert('Error al guardar el producto', 'danger');
    }
}

async function deleteProduct(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            await fetchAPI(`/productos/${id}`, { method: 'DELETE' });
            showAlert('✓ Producto eliminado correctamente', 'success');
            loadProductos();
        } catch (error) {
            console.error('Error deleting producto:', error);
            showAlert('Error al eliminar el producto', 'danger');
        }
    }
}

function editProduct(id) {
    showAlert('ℹ️ Función de edición en desarrollo', 'info');
}
