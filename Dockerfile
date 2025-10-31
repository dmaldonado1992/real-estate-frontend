# Etapa de construcción del frontend
FROM node:16-alpine as frontend-builder

WORKDIR /app

# Copiar archivos de configuración
COPY frontend/package*.json ./
COPY frontend/vite.config.js ./
COPY frontend/postcss.config.js ./
COPY frontend/tailwind.config.js ./

# Instalar dependencias
RUN npm ci --legacy-peer-deps

# Copiar código fuente
COPY frontend/src ./src
COPY frontend/index.html ./

# Construir para producción
RUN npm run build

# Etapa de construcción del backend
FROM python:3.9-slim

WORKDIR /app

# Copiar requirements.txt y instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del backend
COPY main.py .

# Copiar los archivos construidos del frontend
COPY --from=frontend-builder /app/frontend/dist ./static

# Variables de entorno
ENV PORT=8000
ENV HOST=0.0.0.0

# Exponer puerto
EXPOSE 8000

# Comando para iniciar la aplicación
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]