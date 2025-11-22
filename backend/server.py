from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os

# 1. IMPORTANTE: Importamos las nuevas funciones del controlador
from controllers.producto_controller import obtener_productos, crear_producto, actualizar_producto, eliminar_producto

class RequestHandler(BaseHTTPRequestHandler):
    
    # Configuración de cabeceras (CORS) para que el Frontend (HTML) pueda hablar con el Backend
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    # --- LISTAR (GET) ---
    def do_GET(self):
        if self.path == '/api/productos':
            self._set_headers()
            productos = obtener_productos()
            self.wfile.write(json.dumps(productos).encode())
        else:
            self.send_response(404)
            self.end_headers()

    # --- CREAR (POST) ---
    def do_POST(self):
        if self.path == '/api/productos':
            try:
                length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(length)
                data = json.loads(post_data)
                
                exito = crear_producto(data)
                
                self._set_headers()
                if exito:
                    response = {"mensaje": "Producto creado correctamente"}
                else:
                    response = {"error": "No se pudo crear el producto"}
                self.wfile.write(json.dumps(response).encode())
            except Exception as e:
                print(f"Error en POST: {e}")
                self.send_response(500)
                self.end_headers()

    # --- EDITAR (PUT) - NUEVO ---
    def do_PUT(self):
        # Detectar si la URL es del tipo /api/productos/123
        if self.path.startswith('/api/productos/'):
            try:
                # Extraer el ID del final de la URL
                id_producto = self.path.split('/')[-1]
                
                length = int(self.headers['Content-Length'])
                data = json.loads(self.rfile.read(length))
                
                exito = actualizar_producto(id_producto, data)
                
                self._set_headers()
                response = {"success": True} if exito else {"error": "Fallo al actualizar"}
                self.wfile.write(json.dumps(response).encode())
            except Exception as e:
                print(f"Error en PUT: {e}")
                self.send_response(500)
                self.end_headers()

    # --- ELIMINAR (DELETE) - NUEVO ---
    def do_DELETE(self):
        if self.path.startswith('/api/productos/'):
            try:
                id_producto = self.path.split('/')[-1]
                
                exito = eliminar_producto(id_producto)
                
                self._set_headers()
                response = {"success": True} if exito else {"error": "Fallo al eliminar"}
                self.wfile.write(json.dumps(response).encode())
            except Exception as e:
                print(f"Error en DELETE: {e}")
                self.send_response(500)
                self.end_headers()

# Configuración de arranque
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8000))
    server_address = ('', port)
    httpd = HTTPServer(server_address, RequestHandler)
    print(f"Servidor G&M corriendo en el puerto {port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()