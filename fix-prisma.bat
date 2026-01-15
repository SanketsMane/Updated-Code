@echo off
echo ==========================================
echo FIX PRISMA GENERATION
echo ==========================================
echo.
echo 1. Please ensure you have STOPPED the running server (Ctrl+C in your terminal).
echo.
pause
echo.
echo 2. Running prisma generate...
call npx prisma generate
echo.
echo If you saw no errors, you can now run "npm run dev:all"
echo.
pause
