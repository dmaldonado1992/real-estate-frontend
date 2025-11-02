# 🎨 Instalador Frontend + MySQL

Este script instala y configura automáticamente el frontend Vue.js con su propia instancia de MySQL.

## 🚀 Uso

```bash
# Desde la carpeta frontend
install-frontend.bat
```

## 📋 Lo que hace

1. **Lee el Dockerfile del frontend** automáticamente
2. **Configura MySQL** en puerto 3307 (para evitar conflictos)
3. **Construye la imagen** del frontend en modo desarrollo
4. **Inicia los contenedores** con hot-reload activado
5. **Monta volúmenes** para desarrollo en tiempo real

## 🌐 Servicios

- **Frontend**: http://localhost:5173
- **MySQL**: localhost:3306

## 📊 Base de Datos

- **Host**: localhost:3307
- **Usuario**: frontend_user
- **Contraseña**: frontend_pass  
- **Base de datos**: frontend_db

## 🛠️ Comandos útiles

```bash
# Ver logs
docker logs -f frontend-app
docker logs -f frontend-mysql

# Detener
docker stop frontend-app frontend-mysql

# Eliminar
docker rm frontend-app frontend-mysql
docker network rm frontend-network
```

## 💡 Características

- ✅ Hot reload activado
- ✅ Volúmenes montados para desarrollo
- ✅ Red aislada para el frontend
- ✅ Puerto MySQL único (3307)
- ✅ Lee configuración del Dockerfile automáticamente