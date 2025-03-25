Write-Host "Iniciando despliegue a Vercel..." -ForegroundColor Cyan

# Comprobar si hay cambios pendientes
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Tienes cambios sin confirmar:" -ForegroundColor Yellow
    git status
    $commitMessage = Read-Host "Ingresa un mensaje para el commit (o deja en blanco para omitir)"
    
    if ($commitMessage) {
        Write-Host "Confirmando cambios..." -ForegroundColor Green
        git add .
        git commit -m $commitMessage
    } else {
        Write-Host "No se realizarán commits automáticos." -ForegroundColor Yellow
    }
}

# Construir el proyecto
Write-Host "Construyendo el proyecto..." -ForegroundColor Cyan
npm run build

# Desplegar a Vercel
Write-Host "Desplegando a Vercel..." -ForegroundColor Cyan
vercel --prod

Write-Host "¡Proceso completado!" -ForegroundColor Green 