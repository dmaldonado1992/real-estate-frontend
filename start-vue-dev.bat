@echo off
echo Iniciando proyecto Vue con configuracion de memoria optimizada...
echo.

REM Configurar variables de entorno para Node.js
set NODE_OPTIONS=--max-old-space-size=4096 --optimize-for-size

REM Limpiar procesos anteriores
taskkill /f /im node.exe 2>nul

REM Navegar al directorio del proyecto
cd /d "%~dp0"

REM Iniciar el servidor de desarrollo
echo Iniciando servidor de desarrollo Vite...
npm run dev

pause