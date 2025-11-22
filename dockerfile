# Usa una imagen base oficial de Python
FROM python:3.11-slim

# Instala las dependencias de construcción necesarias para PostgreSQL
# Esto reemplaza el comando fallido apt-get en Render
RUN apt-get update && apt-get install -y build-essential libpq-dev

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia todo el contenido del repositorio al contenedor
COPY . .

# Instala las dependencias de Python (usando la versión binaria)
RUN pip install --no-cache-dir -r requerimientos.txt

# El proceso escucha en el puerto definido por Render
EXPOSE $PORT

# Comando para iniciar la aplicación (Asegúrate de que esta ruta sea correcta)
CMD ["python", "backend/server.py"]