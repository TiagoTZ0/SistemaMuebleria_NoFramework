from database import get_connection


def obtener_productos():
    conn = get_connection()
    if not conn:
        return []
    
    cursor = conn.cursor()
    
    query = """
        SELECT p.id_producto, p.nombre, p.sku, p.precio_unitario, p.stock, 
                p.imagen_url, c.nombre as categoria_nombre, 
                p.descripcion, p.stock_minimo, p.id_categoria, p.id_proveedor
        FROM "Producto" p
        LEFT JOIN "Categoria" c ON p.id_categoria = c.id_categoria
        ORDER BY p.id_producto DESC
    """
    
    try:
        cursor.execute(query)
        rows = cursor.fetchall()
        
        productos = []
        for row in rows:
            productos.append({
                "id": row[0],
                "nombre": row[1],
                "sku": row[2],
                "precio": float(row[3]),
                "stock": row[4],
                "imagen": row[5],
                "categoria": row[6] if row[6] else "Sin Categoría",
                "descripcion": row[7],
                "stock_minimo": row[8],
                "categoria_id": row[9],
                "id_proveedor": row[10]
            })
        return productos
        
    except Exception as e:
        print(f"Error al obtener productos: {e}")
        return []
    finally:
        conn.close()

def crear_producto(data):
    conn = get_connection()
    if not conn:
        return False
    
    cursor = conn.cursor()
    try:
        query = """
            INSERT INTO "Producto" (nombre, sku, id_categoria, precio_unitario, stock, 
                                   stock_minimo, imagen_url, descripcion, id_proveedor)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        valores = (
            data['nombre'], 
            data['sku'], 
            data.get('id_categoria', 1), 
            data['precio'], 
            data['stock'], 
            data.get('stock_minimo', 5),
            data.get('imagen', None), 
            data.get('descripcion', ''), 
            data.get('id_proveedor', 1) 
        )
        
        cursor.execute(query, valores)
        conn.commit()
        return True
    except Exception as e:
        print(f"Error al crear producto: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

def actualizar_producto(id_producto, data):
    conn = get_connection()
    if not conn:
        return False
        
    cursor = conn.cursor()
    try:
        query = """
            UPDATE "Producto" 
            SET nombre = %s, 
                sku = %s, 
                id_categoria = %s, 
                precio_unitario = %s, 
                stock = %s, 
                stock_minimo = %s, 
                imagen_url = %s,
                descripcion = %s
            WHERE id_producto = %s
        """
        
        valores = (
            data['nombre'],
            data['sku'],
            data.get('id_categoria', 1),
            data['precio'],
            data['stock'],
            data.get('stock_minimo', 5),
            data.get('imagen', None),
            data.get('descripcion', ''),
            id_producto
        )
        
        cursor.execute(query, valores)
        conn.commit()
        return True
    except Exception as e:
        print(f"Error al actualizar producto: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

def eliminar_producto(id_producto):
    conn = get_connection()
    if not conn:
        return False
    
    cursor = conn.cursor()
    try:
        cursor.execute('DELETE FROM "Producto" WHERE id_producto = %s', (id_producto,))
        conn.commit()
        return True
    except Exception as e:
        print(f"Error al eliminar producto: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()