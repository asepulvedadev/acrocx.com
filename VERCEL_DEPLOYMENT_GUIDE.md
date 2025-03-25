# Guía de Despliegue en Vercel

Este documento te guiará a través del proceso para desplegar esta aplicación en Vercel.

## Prerrequisitos

1. Una cuenta en [Vercel](https://vercel.com/)
2. [Node.js](https://nodejs.org/) instalado en tu sistema
3. [Vercel CLI](https://vercel.com/cli) instalado globalmente

## Pasos para el Despliegue

### 1. Instalar Vercel CLI (si no lo has hecho)

```
npm install -g vercel
```

### 2. Iniciar sesión en tu cuenta Vercel

```
vercel login
```

Sigue las instrucciones para autenticarte con tu cuenta de Vercel.

### 3. Configurar el Proyecto

Desde la raíz del proyecto, ejecuta:

```
vercel
```

Se te pedirá que respondas algunas preguntas:

- **¿Configurar y desplegar el proyecto?** Responde "y"
- **¿A qué alcance (scope) quieres desplegar?** Selecciona tu cuenta o equipo
- **¿Enlazar a un proyecto existente?** Si es la primera vez, selecciona "n"
- **¿Qué nombre quieres darle a tu proyecto?** Puedes usar "acrocxweb" o el nombre que prefieras
- **¿En qué directorio está tu código?** Presiona Enter para usar "./" (directorio actual)
- **¿Quieres modificar estas configuraciones?** Responde "n" a menos que necesites cambiar algo

### 4. Desplegar en Producción

Una vez configurado, puedes hacer el despliegue en producción con:

```
vercel --prod
```

Esto construirá y desplegará tu aplicación en la plataforma de Vercel.

### 5. Integraciones con GitHub (Opcional)

Para una experiencia más fluida, puedes conectar tu repositorio con Vercel a través de GitHub:

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Crea un nuevo proyecto y selecciona tu repositorio de GitHub
3. Configura las opciones de construcción según sea necesario
4. Vercel automáticamente desplegará nuevas versiones cuando hagas push a tu rama principal

## Uso del Script de Despliegue

Para un despliegue más rápido, puedes usar el script PowerShell incluido:

```
.\deploy-vercel.ps1
```

Este script:
1. Verificará si hay cambios sin confirmar y te preguntará si quieres hacer commit
2. Construirá el proyecto con `npm run build`
3. Desplegará la aplicación a Vercel con `vercel --prod`

## Solución de Problemas Comunes

- **Error de permisos en PowerShell**: Si recibes errores de permisos al ejecutar scripts, usa `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` antes de ejecutar el script.
- **Problemas con la build**: Asegúrate de que `npm run build` funciona correctamente en tu máquina local antes de desplegar.
- **Problemas con rutas en Vercel**: La configuración en `vercel.json` debería manejar rutas para aplicaciones SPA correctamente, asegurándote que todas las rutas se redirijan a index.html. 