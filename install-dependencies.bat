@echo off
echo *** INSTALACION DE DEPENDENCIAS ***
echo.
echo Instalando react-helmet-async y otras dependencias necesarias...
echo.

REM Cambiar al directorio del proyecto
cd "C:\Users\mayand\Documents\Niore IA&Marketing\acrocx"

REM Ejecutar los comandos de instalación
call npm install react-helmet-async --save
call npm install web-vitals --save

echo.
if %errorlevel% equ 0 (
  echo Instalacion completada exitosamente!
  echo.
  echo Ahora puedes ejecutar 'build-hostinger.bat' para compilar el proyecto.
) else (
  echo Error durante la instalacion. Por favor revisa los mensajes anteriores.
)

pause 