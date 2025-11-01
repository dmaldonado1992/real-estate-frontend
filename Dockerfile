# Dockerfile multi-stage para desarrollo y producción
FROM node:20-alpine AS base

# Instalar dependencias del sistema
RUN apk add --no-cache curl

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY vite.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./

# Instalar dependencias
RUN npm ci --legacy-peer-deps

# Instalar terser que es requerido por Vite v3+
RUN npm install terser --save-dev

# Etapa de desarrollo
FROM base AS development

# Variables de entorno para desarrollo
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true

# Copiar código fuente
COPY . .

# Crear directorios necesarios
RUN mkdir -p /app/logs

# Exponer puerto de desarrollo
EXPOSE 5173

# Health check para desarrollo
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD curl -f http://localhost:5173 || exit 1

# Comando para desarrollo con hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Etapa de construcción para producción
FROM base AS build-stage

# Copiar código fuente
COPY src ./src
COPY index.html ./

# Construir para producción
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine AS production

# Copiar archivos construidos
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto
EXPOSE 80

# Health check para producción
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:80 || exit 1

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]