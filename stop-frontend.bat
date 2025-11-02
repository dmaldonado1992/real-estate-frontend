@echo off
echo.
echo Deteniendo frontend...
echo.

echo Deteniendo contenedores...
docker stop frontend-app 2>nul

echo Eliminando contenedores...
docker rm frontend-app 2>nul

echo Eliminando red...
docker network rm frontend-network 2>nul

echo.
echo OK: Frontend detenido completamente
echo.
pause