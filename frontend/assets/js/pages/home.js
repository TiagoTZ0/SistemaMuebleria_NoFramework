function loadHomePage() {
    renderLastSales();
}

function renderLastSales() {
    // Datos simulados para que el Home no se vea vacío
    const sales = [
        { id: '1024', monto: 'S/ 2,400', estado: 'Pendiente', color: '#ff9800', bg: '#FFF3E0' },
        { id: '1023', monto: 'S/ 1,599', estado: 'Completado', color: '#4caf50', bg: '#E8F5E9' },
        { id: '1022', monto: 'S/ 3,650', estado: 'Completado', color: '#4caf50', bg: '#E8F5E9' }
    ];
    
    const container = document.getElementById('lastSalesList');
    if (container) {
        container.innerHTML = sales.map(s => `
            <div style="padding-bottom: 0.75rem; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center;">
                <p style="margin: 0; font-weight: 500;">Venta #${s.id}</p>
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <span style="color: var(--btn-primary-bg); font-weight: 600;">${s.monto}</span>
                    <span style="background:${s.bg}; color:${s.color}; padding:2px 8px; border-radius:4px; font-size:0.8rem;">${s.estado}</span>
                </div>
            </div>
        `).join('');
    }
}