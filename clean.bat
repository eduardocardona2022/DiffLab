@echo off
setlocal
title DiffLab - limpieza
cd /d "%~dp0"
set "DIFFLAB_DIR=%~dp0"

echo.
echo  DiffLab - limpieza del proyecto
echo  ===============================
echo.

echo Deteniendo la aplicacion si esta en ejecucion...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$project = ($env:DIFFLAB_DIR).TrimEnd('\'); $targets = @(Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -and $_.CommandLine.IndexOf($project, [System.StringComparison]::OrdinalIgnoreCase) -ge 0 -and $_.CommandLine -match 'vite' }); if ($targets.Count -eq 0) { Write-Host 'No hay una instancia de DiffLab en ejecucion.' } else { foreach ($target in $targets) { Write-Host ('Deteniendo servidor (PID ' + $target.ProcessId + ')...'); Stop-Process -Id $target.ProcessId -Force -ErrorAction SilentlyContinue }; Start-Sleep -Milliseconds 800; Write-Host 'Servidor detenido.' }"
echo.

set "HAS_TARGETS=0"
if exist "node_modules" set "HAS_TARGETS=1"
if exist "dist" set "HAS_TARGETS=1"
if exist "coverage" set "HAS_TARGETS=1"

if "%HAS_TARGETS%"=="0" (
  echo No hay carpetas generadas para eliminar.
  echo.
  pause
  exit /b 0
)

echo Se eliminaran estas carpetas generadas:
if exist "node_modules" echo   - node_modules  ^(dependencias; se reinstalan con init.bat^)
if exist "dist" echo   - dist          ^(build de produccion^)
if exist "coverage" echo   - coverage      ^(reportes de pruebas^)
echo.
choice /C SN /N /M "Continuar? [S] Si / [N] No: "
if errorlevel 2 (
  echo.
  echo Operacion cancelada.
  echo.
  pause
  exit /b 0
)

echo.
call :DeleteFolder "node_modules"
call :DeleteFolder "dist"
call :DeleteFolder "coverage"

echo.
if defined CLEAN_FAILED (
  echo La limpieza termino con avisos.
  echo Cierra editores o terminales que puedan estar usando esas carpetas e intentalo de nuevo.
) else (
  echo Limpieza completada. Las carpetas generadas se eliminaron.
)
echo Ejecuta init.bat cuando quieras volver a abrir la aplicacion.
echo.
pause
endlocal
exit /b 0

:DeleteFolder
if not exist "%~1" exit /b 0
echo Eliminando %~1...
rd /s /q "%~1" 2>nul
if exist "%~1" (
  timeout /t 1 /nobreak >nul
  rd /s /q "%~1" 2>nul
)
if exist "%~1" (
  echo [AVISO] No se pudo eliminar %~1 por completo.
  set "CLEAN_FAILED=1"
) else (
  echo   OK
)
exit /b 0
