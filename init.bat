@echo off
setlocal
title DiffLab
cd /d "%~dp0"

echo.
echo  DiffLab - comparador de texto
echo  ============================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] No se encontro Node.js en el PATH.
  echo Instala Node.js 20.19 o superior desde https://nodejs.org/
  echo.
  pause
  exit /b 1
)

node -e "const v = process.versions.node.split('.').map(Number); process.exit(v[0] > 20 || (v[0] === 20 && v[1] >= 19) ? 0 : 1)"
if errorlevel 1 (
  echo [ERROR] Se requiere Node.js 20.19 o superior.
  echo Version detectada:
  node --version
  echo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm no esta disponible en el PATH.
  echo Reinstala Node.js incluyendo npm.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\.bin\vite.cmd" (
  echo Instalando dependencias. Esto puede tardar unos minutos la primera vez...
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo [ERROR] No se pudieron instalar las dependencias.
    echo Revisa tu conexion a internet e intentalo de nuevo.
    echo.
    pause
    exit /b 1
  )
  echo.
)

echo Iniciando DiffLab...
echo El navegador se abrira automaticamente.
echo Para detener la aplicacion, cierra esta ventana o pulsa Ctrl+C.
echo.

call npm run dev -- --open

if errorlevel 1 (
  echo.
  echo La aplicacion se detuvo.
  echo Si no la cerraste tu, revisa el mensaje anterior.
  echo.
  pause
)

endlocal
