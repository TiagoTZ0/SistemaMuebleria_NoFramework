# Usa una imagen base oficial de Python
FROM python:3.11-slim

# Instala las dependencias de construcción necesarias para PostgreSQL
# Esto se hace usando apt-get dentro del contenedor, donde sí está permitido.
RUN apt-get update && apt-get install -y build-essential libpq-dev

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia todo el contenido del repositorio a /usr/src/app
COPY . .

# Instala las dependencias de Python (Asegurándonos que el nombre es CORRECTO)
RUN pip install --no-cache-dir -r requirements.txt

# Comando para iniciar la aplicación, usando la ruta correcta al servidor
# Render busca server.py dentro de backend/
CMD ["python", "backend/server.py"]