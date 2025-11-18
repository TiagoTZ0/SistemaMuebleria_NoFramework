@echo off
REM Batch file para iniciar el sistema completo

echo.
echo ============================================
echo Sistema de Muebleria GM - Versión Vanilla
echo ============================================
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python no está instalado o no está en el PATH
    echo Descarga Python desde https://www.python.org/
    pause
    exit /b 1
)

echo [1/2] Iniciando servidor backend...
echo.

REM Cambiar a directorio backend e iniciar servidor
cd /d "%~dp0backend"
start "Sistema GM - Backend" python server.py

REM Esperar a que el servidor inicie
timeout /t 3 /nobreak

echo.
echo [2/2] Abriendo frontend en navegador...
echo.

REM Abrir el frontend en el navegador predeterminado
cd /d "%~dp0frontend"
start "" "%~dp0frontend\index.html"

echo.
echo ============================================
echo Sistema iniciado correctamente!
echo.
echo - Frontend: file:///%~dp0frontend/index.html
echo - Backend: http://localhost:8000
echo.
echo Para cerrar el sistema, cierra la ventana del servidor
echo ============================================
echo.

pause
