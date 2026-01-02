@echo off
echo Building application for production (this may take a moment)...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed. Please check errors above.
    pause
    exit /b %errorlevel%
)

echo.
echo Starting application in production mode...
echo Access the dashboard at http://localhost:3000
call npm start
pause
