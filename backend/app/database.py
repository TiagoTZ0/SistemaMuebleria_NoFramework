import json
import os
from datetime import datetime

class Database:
    def __init__(self, data_dir='data'):
        self.data_dir = data_dir
        self.products_file = os.path.join(data_dir, 'productos.json')
        self._ensure_data_file()
    
    def _ensure_data_file(self):
        """Crea el archivo de datos si no existe"""
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
        
        if not os.path.exists(self.products_file):
            initial_data = {
                'productos': [
                    {
                        'id': 1,
                        'descripcion': 'Cama King',
                        'sku': 'CAMA001',
                        'codigoBarras': '7891234567890',
                        'categoria': 'Muebles',
                        'marca': 'Ensueño',
                        'precio': 1777,
                        'stockMinimo': 5,
                        'stockActual': 12,
                        'createdAt': datetime.now().isoformat()
                    },
                    {
                        'id': 2,
                        'descripcion': 'Mesa Comedor',
                        'sku': 'MESA001',
                        'codigoBarras': '7891234567891',
                        'categoria': 'Muebles',
                        'marca': 'Oasis',
                        'precio': 899,
                        'stockMinimo': 3,
                        'stockActual': 8,
                        'createdAt': datetime.now().isoformat()
                    }
                ]
            }
            self._save_data(initial_data)
    
    def _load_data(self):
        """Carga los datos del archivo JSON"""
        try:
            with open(self.products_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {'productos': []}
    
    def _save_data(self, data):
        """Guarda los datos al archivo JSON"""
        with open(self.products_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def get_all_productos(self):
        """Obtiene todos los productos"""
        data = self._load_data()
        return data.get('productos', [])
    
    def get_producto(self, id):
        """Obtiene un producto por ID"""
        productos = self.get_all_productos()
        for p in productos:
            if p['id'] == id:
                return p
        return None
    
    def create_producto(self, producto_data):
        """Crea un nuevo producto"""
        data = self._load_data()
        productos = data.get('productos', [])
        
        # Generar nuevo ID
        new_id = max([p['id'] for p in productos], default=0) + 1
        
        nuevo_producto = {
            'id': new_id,
            'descripcion': producto_data.get('descripcion', ''),
            'sku': producto_data.get('sku', ''),
            'codigoBarras': producto_data.get('codigoBarras', ''),
            'categoria': producto_data.get('categoria', ''),
            'marca': producto_data.get('marca', ''),
            'precio': float(producto_data.get('precio', 0)),
            'stockMinimo': int(producto_data.get('stockMinimo', 0)),
            'stockActual': int(producto_data.get('stockActual', 0)),
            'createdAt': datetime.now().isoformat()
        }
        
        productos.append(nuevo_producto)
        data['productos'] = productos
        self._save_data(data)
        
        return nuevo_producto
    
    def update_producto(self, id, producto_data):
        """Actualiza un producto"""
        data = self._load_data()
        productos = data.get('productos', [])
        
        for i, p in enumerate(productos):
            if p['id'] == id:
                p.update({
                    'descripcion': producto_data.get('descripcion', p['descripcion']),
                    'sku': producto_data.get('sku', p['sku']),
                    'codigoBarras': producto_data.get('codigoBarras', p['codigoBarras']),
                    'categoria': producto_data.get('categoria', p['categoria']),
                    'marca': producto_data.get('marca', p['marca']),
                    'precio': float(producto_data.get('precio', p['precio'])),
                    'stockMinimo': int(producto_data.get('stockMinimo', p['stockMinimo'])),
                    'stockActual': int(producto_data.get('stockActual', p['stockActual'])),
                    'updatedAt': datetime.now().isoformat()
                })
                data['productos'] = productos
                self._save_data(data)
                return p
        
        return None
    
    def delete_producto(self, id):
        """Elimina un producto"""
        data = self._load_data()
        productos = data.get('productos', [])
        
        for i, p in enumerate(productos):
            if p['id'] == id:
                del productos[i]
                data['productos'] = productos
                self._save_data(data)
                return True
        
        return False
