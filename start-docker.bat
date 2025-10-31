@echo off
echo Iniciando Docker Desktop como administrador...
powershell -Command "Start-Process 'C:\Program Files\Docker\Docker\Docker Desktop.exe' -Verb RunAs"
echo Esperando a que Docker Desktop inicie...
timeout /t 30
echo Verificando el estado de Docker...
docker --version
echo.
echo Si ves la versión de Docker arriba, el servicio se ha iniciado correctamente.
echo Si no ves la versión, espera unos momentos más mientras Docker Desktop termina de iniciar.
pause