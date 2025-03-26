@echo off
echo *** COMPILACION PARA HOSTINGER ***
echo.
echo Iniciando proceso de compilacion...
echo.

REM Cambiar al directorio del proyecto
cd "C:\Users\mayand\Documents\Niore IA&Marketing\acrocx"

REM Intentar compilar
call npm run build:hostinger

echo.
if %errorlevel% equ 0 (
  echo Compilacion completada exitosamente!
  echo.
  echo Los archivos para subir a Hostinger estan en la carpeta 'dist'
  echo No olvides subir tambien el archivo .htaccess
) else (
  echo Error durante la compilacion.
  echo.
  echo Si el error es sobre dependencias faltantes, ejecuta primero:
  echo install-dependencies.bat
  echo.
  echo Si el error persiste, comprueba si hay problemas con:
  echo - Modulos de Node faltantes
  echo - Referencias a archivos que no existen
  echo - Problemas de sintaxis en el codigo
)

pause 