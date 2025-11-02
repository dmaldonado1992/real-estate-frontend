@echo off
setlocal enabledelayedexpansion
title Instalador Frontend 
color 0E

echo ===============================================
echo    INSTALADOR FRONTEND 
echo ===============================================
echo.

cd /d "%~dp0"

:: Buscar carpeta frontend si no estamos en ella
if not exist "package.json" (
    if exist "frontend\package.json" (
        echo Cambiando a directorio frontend...
        cd frontend
    ) else (
        echo ERROR: No se encuentra la carpeta frontend ni package.json
        pause
        exit /b 1
    )
)

echo Directorio Frontend: %CD%
echo.

::Verificar Docker
echo Verificando Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no esta disponible
    echo Por favor instala Docker Desktop
    pause
    exit /b 1
)

echo Verificando Docker daemon...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker daemon no esta corriendo
    echo Por favor inicia Docker Desktop y espera a que este listo
    echo Presiona cualquier tecla cuando Docker Desktop este ejecutandose...
    pause
    
    :: Reintentar conexion
    docker info >nul 2>&1
    if %errorlevel% neq 0 (
        echo ERROR: Docker sigue sin responder
        echo Verifica que Docker Desktop este completamente iniciado
        pause
        exit /b 1
    )
)

echo OK: Docker esta listo
echo.

::Verificar Dockerfile
if not exist "Dockerfile" (
    echo ERROR: Dockerfile no encontrado en el directorio actual
    pause
    exit /b 1
)

echo OK: Dockerfile encontrado
echo.

echo Leyendo configuración del Dockerfile...

:: Extraer información del Dockerfile
for /f "tokens=2" %%i in ('findstr /c:"EXPOSE" Dockerfile 2^>nul') do set "frontend_port=%%i"
if "%frontend_port%"=="" set frontend_port=5173

:: Forzar puerto 5173
set frontend_port=5173

echo   Puerto del frontend: %frontend_port%
echo.

echo Verificando contenedor frontend-app...

:: Verificar si el contenedor existe y esta corriendo
docker ps -q --filter "name=frontend-app" > temp_container.txt
set /p container_running=<temp_container.txt
del temp_container.txt 2>nul

if not "%container_running%"=="" (
    echo Contenedor frontend-app esta corriendo - actualizando con nuevos cambios...
    echo Deteniendo contenedor...
    docker stop frontend-app
    echo Eliminando contenedor...
    docker rm frontend-app
    echo Reconstruyendo imagen con cambios recientes...
    docker build -t frontend-app --target development .
    if %errorlevel% neq 0 (
        echo ERROR: Error reconstruyendo imagen del frontend
        pause
        exit /b 1
    )
    echo Creando nuevo contenedor con cambios...
    docker run -d ^
        --name frontend-app ^
        --network frontend-network ^
        -p %frontend_port%:%frontend_port% ^
        -v "%CD%:/app" ^
        -v /app/node_modules ^
        -e NODE_ENV=development ^
        -e CHOKIDAR_USEPOLLING=true ^
        frontend-app
    if %errorlevel% neq 0 (
        echo ERROR: Error iniciando contenedor actualizado
        pause
        exit /b 1
    )
    echo OK: Contenedor actualizado con nuevos cambios
    goto :show_status
)

:: Verificar si el contenedor existe (detenido)
docker ps -aq --filter "name=frontend-app" > temp_container.txt
set /p container_exists=<temp_container.txt
del temp_container.txt 2>nul

if not "%container_exists%"=="" (
    echo Eliminando contenedor frontend-app existente...
    docker rm frontend-app
)

:: Limpiar red si existe
docker network ls --filter "name=frontend-network" --format "{{.Name}}" > temp_network.txt
set /p network_exists=<temp_network.txt
del temp_network.txt 2>nul

if not "%network_exists%"=="" (
    echo Eliminando red frontend-network existente...
    docker network rm frontend-network
)

echo.
echo Creando red para frontend...
docker network create frontend-network

echo.
echo Construyendo imagen del frontend...
docker build -t frontend-app --target development .

if %errorlevel% neq 0 (
    echo ERROR: Error construyendo imagen del frontend
    pause
    exit /b 1
)

echo OK: Imagen del frontend construida
echo.

echo Iniciando contenedor del frontend...
docker run -d ^
    --name frontend-app ^
    --network frontend-network ^
    -p %frontend_port%:%frontend_port% ^
    -v "%CD%:/app" ^
    -v /app/node_modules ^
    -e NODE_ENV=development ^
    -e CHOKIDAR_USEPOLLING=true ^
    frontend-app

if %errorlevel% neq 0 (
    echo ERROR: Error iniciando contenedor del frontend
    pause
    exit /b 1
)

echo OK: Frontend iniciado
echo.

:show_status
echo Esperando que el frontend este listo...
timeout /t 10 /nobreak > nul

echo.
echo Verificando estado de contenedores...
docker ps --filter "name=frontend-"

echo.
echo ===============================================
echo    INSTALACION FRONTEND COMPLETADA
echo ===============================================
echo.

echo SERVICIOS DISPONIBLES:
echo   Frontend:  http://localhost:%frontend_port%
echo.

echo COMANDOS UTILES:
echo.
echo   Ver logs del frontend:
echo      docker logs -f frontend-app
echo.
echo   Detener servicios:
echo      docker stop frontend-app
echo.
echo   Eliminar servicios:
echo      docker rm frontend-app
echo      docker network rm frontend-network
echo.

echo DESARROLLO:
echo   Los archivos estan montados como volumen
echo   Los cambios se reflejan automaticamente
echo   Hot reload esta activado
echo.

echo Abriendo frontend en el navegador...
timeout /t 3 /nobreak > nul
start http://localhost:%frontend_port%

echo.
echo El frontend esta corriendo en segundo plano.
echo Para ver los logs en tiempo real ejecuta:
echo    docker logs -f frontend-app
echo.

pause