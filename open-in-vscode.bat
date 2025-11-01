@echo off
echo Abriendo proyecto Vue en VS Code...
echo.

REM Configurar variables de entorno para VS Code
set NODE_OPTIONS=--max-old-space-size=4096

REM Limpiar procesos anteriores de Node.js
taskkill /f /im node.exe 2>nul

REM Navegar al directorio del proyecto
cd /d "%~dp0"

REM Abrir VS Code en el directorio actual
code .

echo VS Code se esta abriendo con tu proyecto Vue...
echo Si experimentas problemas de memoria, usa start-vue-dev.bat para iniciar el servidor.

pause