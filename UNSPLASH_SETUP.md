# 📸 Configuración de Unsplash API

## Pasos para obtener tu Access Key

### 1. Registrarse en Unsplash Developers
- Ve a https://unsplash.com/developers
- Crea una cuenta o inicia sesión con tu cuenta de Unsplash
- Acepta los términos de uso de la API de Unsplash

### 2. Crear una Nueva Aplicación
1. Ve a https://unsplash.com/oauth/applications
2. Haz clic en **"New Application"**
3. Completa el formulario:
   - **Application name**: `Palo Blanco Real Estate`
   - **Description**: `Real estate property listings website`
   - Lee y acepta los términos y condiciones
4. Haz clic en **"Create Application"**

### 3. Obtener tu Access Key
En la página de tu aplicación verás:
- **Access Key** (clave pública) - Este es el que necesitas
- **Secret Key** (clave privada) - NO compartir

### 4. Configurar en el Proyecto

1. Abre el archivo `.env` en la raíz de `frontend/`
2. Encuentra la línea:
   ```
   VITE_UNSPLASH_ACCESS_KEY=YOUR_UNSPLASH_ACCESS_KEY
   ```
3. Reemplaza `YOUR_UNSPLASH_ACCESS_KEY` con tu Access Key real:
   ```
   VITE_UNSPLASH_ACCESS_KEY=tu_access_key_aqui
   ```
4. Guarda el archivo

### 5. Reiniciar el Frontend
```bash
# Detener el servidor si está corriendo (Ctrl+C)
# Luego ejecutar:
npm run dev
```

## ⚠️ Importante

- **NO subas tu `.env` a Git** (ya está en `.gitignore`)
- El Access Key es PÚBLICO y puede usarse en el frontend
- El Secret Key es PRIVADO y nunca debe exponerse
- Límites de Unsplash (plan gratuito):
  - 50 requests por hora
  - Adecuado para desarrollo

## 🎨 Alternativa: Usar Placeholders

Si no quieres usar Unsplash, el sistema automáticamente usará placeholders de https://placehold.co cuando:
- No hay token configurado
- La URL está vacía
- Hay un error al cargar

## ✅ Verificar que Funciona

1. Abre http://localhost:5173
2. Ve a la sección de Propiedades
3. Las imágenes deberían cargarse desde Unsplash
4. Abre la consola del navegador (F12) y verifica que no haya errores 403

## 📚 Documentación Oficial

- Unsplash API Docs: https://unsplash.com/documentation
- Guía de inicio: https://unsplash.com/documentation#getting-started
