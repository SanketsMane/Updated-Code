@echo off
echo ==========================================
echo KIDOKOOL LMS - STARTUP
echo ==========================================
echo.
echo Launching WebSocket Server...
start "Kidokool WebSocket" cmd /k "npx tsx lib/websocket-server.js"
echo.
echo Launching Next.js Application...
echo (This may take a moment to compile)
start "Kidokool App" cmd /k "npx next dev"
echo.
echo Both servers have been launched in separate windows.
echo You can keep this window open or close it.
echo.
pause
