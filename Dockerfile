# Etapa de construcción
FROM node:20-alpine as build-stage

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY vite.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./

# Instalar dependencias
RUN npm ci --legacy-peer-deps

# Copiar código fuente
COPY src ./src
COPY index.html ./

# Construir para producción
RUN npm run build

# Etapa de producción
FROM nginx:stable-alpine as production-stage

# Copiar archivos construidos
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]