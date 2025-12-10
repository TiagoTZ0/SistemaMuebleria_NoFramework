from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os
import mimetypes

from controllers.producto_controller import obtener_productos, crear_producto, actualizar_producto, eliminar_producto

FRONTEND_BASE_DIR = 'frontend'

class RequestHandler(BaseHTTPRequestHandler):
    
    def _set_headers(self, status=200, content_type='application/json'):
        self.send_response(status)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_GET(self):
        if self.path == '/api/productos':
            self._set_headers()
            productos = obtener_productos()
            self.wfile.write(json.dumps(productos).encode())
            return
        
        if self.path == '/':
            requested_file = os.path.join(FRONTEND_BASE_DIR, 'index.html')
        else:
            requested_file = os.path.join(FRONTEND_BASE_DIR, self.path.lstrip('/'))

        content_type, _ = mimetypes.guess_type(requested_file)
        if content_type is None:
            content_type = 'application/octet-stream'

        try:
            with open(requested_file, 'rb') as file:
                self._set_headers(status=200, content_type=content_type)
                self.wfile.write(file.read())
            return

        except FileNotFoundError:
            if not self.path.startswith('/assets/'):
                try:
                    requested_file = os.path.join(FRONTEND_BASE_DIR, 'index.html')
                    with open(requested_file, 'rb') as file:
                        self._set_headers(status=200, content_type='text/html')
                        self.wfile.write(file.read())
                    return
                except FileNotFoundError:
                    pass

            self.send_response(404)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b"404: Archivo no encontrado en el servidor")
            return
        
        except Exception as e:
            print(f"Error al servir archivo estático: {e}")
            self.send_response(500)
            self.end_headers()
            return

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

    def do_PUT(self):
        if self.path.startswith('/api/productos/'):
            try:
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