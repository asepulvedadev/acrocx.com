@echo off
echo *** COMPILACION PARA HOSTINGER ***
echo.
echo Iniciando proceso de compilacion...
echo.

REM Cambiar al directorio del proyecto
cd "C:\Users\mayand\Documents\Niore IA&Marketing\acrocx"

REM Limpiar node_modules y reinstalar (opcional - descomentar si se necesita)
REM echo Limpiando cache y node_modules...
REM if exist node_modules rmdir /s /q node_modules
REM del package-lock.json
REM echo Reinstalando dependencias...
REM call npm install

REM Asegurar disponibilidad de los archivos críticos
if not exist src\critical.css (
  echo ERROR: No se encuentra el archivo src\critical.css
  goto error
)

REM Intentar compilar
echo Compilando el proyecto...
call npm run build:hostinger

echo.
if %errorlevel% equ 0 (
  echo ===================================================
  echo Compilacion completada exitosamente!
  echo ===================================================
  echo.
  echo Los archivos para subir a Hostinger estan en la carpeta 'dist'
  echo Por favor, no olvides:
  echo  1. Subir el archivo .htaccess junto con todo el contenido de dist
  echo  2. Subir los archivos a la carpeta raiz public_html en Hostinger
  echo.
  echo ¡Listo para desplegar!
) else (
  :error
  echo ===================================================
  echo ERROR: La compilacion ha fallado
  echo ===================================================
  echo.
  echo Posibles soluciones:
  echo  1. Ejecuta 'install-dependencies.bat' para instalar dependencias
  echo  2. Verifica que todos los archivos referenciados existen
  echo  3. Prueba a ejecutar 'npm run build' sin personalización
  echo.
  echo Si persiste el problema, considera ejecutar la aplicación con:
  echo  npm run dev
  echo.
  echo Y revisa la consola para ver errores específicos.
)

pause 