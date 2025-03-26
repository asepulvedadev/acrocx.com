@echo off
echo *** INSTALACION DE DEPENDENCIAS ***
echo.
echo Instalando dependencias necesarias...
echo.

REM Cambiar al directorio del proyecto
cd "C:\Users\mayand\Documents\Niore IA&Marketing\acrocx"

REM Asegurar que existe el archivo package.json
if not exist package.json (
  echo ERROR: No se encuentra el archivo package.json
  echo Este script debe ejecutarse desde la carpeta del proyecto.
  goto end
)

REM Verificar si npm está disponible
where npm >nul 2>nul
if %errorlevel% neq 0 (
  echo ERROR: npm no está disponible en el sistema
  echo Por favor, instala Node.js desde https://nodejs.org/
  goto end
)

echo Instalando dependencias principales...
call npm install react react-dom react-router-dom @supabase/supabase-js --save

echo.
echo Instalando dependencias adicionales...
call npm install react-helmet-async web-vitals --save

echo.
if %errorlevel% equ 0 (
  echo ===================================================
  echo Instalacion completada exitosamente!
  echo ===================================================
  echo.
  echo Ahora puedes ejecutar 'build-hostinger.bat' para compilar el proyecto.
) else (
  echo ===================================================
  echo ERROR: La instalacion ha fallado
  echo ===================================================
  echo.
  echo Posibles soluciones:
  echo  1. Ejecuta PowerShell como administrador y ejecuta:
  echo     Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  echo  2. Intenta ejecutar CMD como administrador y ejecuta este script
  echo  3. Verifica tu conexión a internet
)

:end
pause 