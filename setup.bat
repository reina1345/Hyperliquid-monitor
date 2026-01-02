@echo off
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error occurred during installation.
    pause
    exit /b %errorlevel%
)
echo Installation complete!
pause
