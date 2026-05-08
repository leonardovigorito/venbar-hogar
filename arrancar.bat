@echo off
title Venbar Hogar — Servidores
color 0A

set "NODE_DIR=C:\Users\leona\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.15.0-win-x64"
set "PATH=%NODE_DIR%;%PATH%"

echo.
echo  ==========================================
echo   VENBAR HOGAR — Iniciando servidores...
echo  ==========================================
echo.

echo  [1/2] Iniciando backend (puerto 5000)...
start "Venbar Backend" cmd /k "set PATH=%NODE_DIR%;%PATH% && cd /d C:\Users\leona\tienda-telas\backend && node src\app.js"

timeout /t 3 /nobreak >nul

echo  [2/2] Iniciando frontend (puerto 3000)...
start "Venbar Frontend" cmd /k "set PATH=%NODE_DIR%;%PATH% && cd /d C:\Users\leona\tienda-telas\frontend && node %NODE_DIR%\node_modules\npm\bin\npm-cli.js run dev"

timeout /t 7 /nobreak >nul

echo  Abriendo la tienda...
start http://localhost:3000

echo.
echo  Servidores corriendo. Cerrá esta ventana.
pause
