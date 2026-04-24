@echo off
setlocal
set PORT=8080
set URL=http://localhost:%PORT%/novel-reader.html

cd /d "%~dp0"

echo Starting Novel Reader on port %PORT%...
start "novel-reader server" /min cmd /c "python -m http.server %PORT%"

rem Wait a moment for the server to bind
timeout /t 1 /nobreak >nul

start "" "%URL%"
echo.
echo Server running in minimized window. Close that window to stop.
echo URL: %URL%
