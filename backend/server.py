#!/usr/bin/env python3
"""
Servidor HTTP simple para Sistema de Mueblería G&M
Proporciona API REST para CRUD de productos
"""

import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import uuid
from datetime import datetime

# Rutas de archivos
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
PRODUCTOS_FILE = os.path.join(DATA_DIR, 'productos.json')

# Asegurar que el directorio de datos existe
os.makedirs(DATA_DIR, exist_ok=True)


class Database:
    """Gestor de base de datos en JSON"""

    @staticmethod
    def load_productos():
        """Carga productos desde archivo JSON"""
        if not os.path.exists(PRODUCTOS_FILE):
            return []
        try:
            with open(PRODUCTOS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []

    @staticmethod
    def save_productos(productos):
        """Guarda productos en archivo JSON"""
        os.makedirs(DATA_DIR, exist_ok=True)
        with open(PRODUCTOS_FILE, 'w', encoding='utf-8') as f:
            json.dump(productos, f, indent=2, ensure_ascii=False)

    @staticmethod
    def get_all():
        """Obtiene todos los productos"""
        return Database.load_productos()

    @staticmethod
    def get_by_id(product_id):
        """Obtiene un producto por ID"""
        productos = Database.load_productos()
        for p in productos:
            if p.get('id') == product_id:
                return p
        return None

    @staticmethod
    def create(data):
        """Crea un nuevo producto"""
        productos = Database.load_productos()
        
        nuevo_producto = {
            'id': str(uuid.uuid4())[:8],
            'descripcion': data.get('descripcion'),
            'sku': data.get('sku', ''),
            'codigoBarras': data.get('codigoBarras', ''),
            'categoria': data.get('categoria'),
            'marca': data.get('marca'),
            'precio': float(data.get('precio', 0)),
            'stockMinimo': int(data.get('stockMinimo', 0)),
            'stockActual': int(data.get('stockActual', 0)),
            'fechaCreacion': datetime.now().isoformat()
        }
        
        productos.append(nuevo_producto)
        Database.save_productos(productos)
        return nuevo_producto

    @staticmethod
    def update(product_id, data):
        """Actualiza un producto"""
        productos = Database.load_productos()
        
        for i, p in enumerate(productos):
            if p.get('id') == product_id:
                productos[i].update({
                    'descripcion': data.get('descripcion', p.get('descripcion')),
                    'sku': data.get('sku', p.get('sku')),
                    'codigoBarras': data.get('codigoBarras', p.get('codigoBarras')),
                    'categoria': data.get('categoria', p.get('categoria')),
                    'marca': data.get('marca', p.get('marca')),
                    'precio': float(data.get('precio', p.get('precio'))),
                    'stockMinimo': int(data.get('stockMinimo', p.get('stockMinimo'))),
                    'stockActual': int(data.get('stockActual', p.get('stockActual'))),
                })
                Database.save_productos(productos)
                return productos[i]
        return None

    @staticmethod
    def delete(product_id):
        """Elimina un producto"""
        productos = Database.load_productos()
        productos = [p for p in productos if p.get('id') != product_id]
        Database.save_productos(productos)
        return True


class APIHandler(BaseHTTPRequestHandler):
    """Manejador de solicitudes HTTP"""

    def _set_headers(self, status_code=200, content_type='application/json'):
        """Establece headers de respuesta"""
        self.send_response(status_code)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        """Maneja solicitudes OPTIONS para CORS"""
        self._set_headers()

    def do_GET(self):
        """Maneja solicitudes GET"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        if path == '/api/productos':
            productos = Database.get_all()
            self._set_headers(200)
            self.wfile.write(json.dumps(productos, ensure_ascii=False).encode('utf-8'))
        
        elif path.startswith('/api/productos/'):
            product_id = path.split('/')[-1]
            producto = Database.get_by_id(product_id)
            
            if producto:
                self._set_headers(200)
                self.wfile.write(json.dumps(producto, ensure_ascii=False).encode('utf-8'))
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({'error': 'Producto no encontrado'}).encode('utf-8'))
        
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Endpoint no encontrado'}).encode('utf-8'))

    def do_POST(self):
        """Maneja solicitudes POST"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        if path == '/api/productos':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            
            try:
                data = json.loads(body.decode('utf-8'))
                producto = Database.create(data)
                self._set_headers(201)
                self.wfile.write(json.dumps(producto, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self._set_headers(400)
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Endpoint no encontrado'}).encode('utf-8'))

    def do_PUT(self):
        """Maneja solicitudes PUT"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        if path.startswith('/api/productos/'):
            product_id = path.split('/')[-1]
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            
            try:
                data = json.loads(body.decode('utf-8'))
                producto = Database.update(product_id, data)
                
                if producto:
                    self._set_headers(200)
                    self.wfile.write(json.dumps(producto, ensure_ascii=False).encode('utf-8'))
                else:
                    self._set_headers(404)
                    self.wfile.write(json.dumps({'error': 'Producto no encontrado'}).encode('utf-8'))
            except Exception as e:
                self._set_headers(400)
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Endpoint no encontrado'}).encode('utf-8'))

    def do_DELETE(self):
        """Maneja solicitudes DELETE"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path

        if path.startswith('/api/productos/'):
            product_id = path.split('/')[-1]
            Database.delete(product_id)
            self._set_headers(204)
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Endpoint no encontrado'}).encode('utf-8'))

    def log_message(self, format, *args):
        """Personaliza los logs del servidor"""
        print(f"[{self.log_date_time_string()}] {format % args}")


def run_server(host='localhost', port=8000):
    """Inicia el servidor HTTP"""
    server_address = (host, port)
    httpd = HTTPServer(server_address, APIHandler)
    
    print(f"🚀 Servidor iniciado en http://{host}:{port}")
    print(f"📁 Datos guardados en: {PRODUCTOS_FILE}")
    print("Endpoints disponibles:")
    print(f"  GET    /api/productos          - Obtener todos los productos")
    print(f"  GET    /api/productos/{{id}}    - Obtener un producto por ID")
    print(f"  POST   /api/productos          - Crear un nuevo producto")
    print(f"  PUT    /api/productos/{{id}}    - Actualizar un producto")
    print(f"  DELETE /api/productos/{{id}}    - Eliminar un producto")
    print("\nPresiona Ctrl+C para detener el servidor")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✓ Servidor detenido correctamente")
        httpd.server_close()


if __name__ == '__main__':
    run_server()
