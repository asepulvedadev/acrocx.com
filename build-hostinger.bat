@echo off
echo *** COMPILACION PARA HOSTINGER ***
echo.
echo Iniciando proceso de compilacion...
echo.

REM Cambiar al directorio del proyecto
cd "C:\Users\mayand\Documents\Niore IA&Marketing\acrocx"

REM Ejecutar el comando de compilación
call npm run build:hostinger

echo.
if %errorlevel% equ 0 (
  echo Compilacion completada exitosamente!
  echo.
  echo Los archivos para subir a Hostinger estan en la carpeta 'dist'
  echo No olvides subir tambien el archivo .htaccess
) else (
  echo Error durante la compilacion. Por favor revisa los mensajes anteriores.
)

pause 