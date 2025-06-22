@echo off
echo.
echo =========================================
echo  Financial Adviser App - Local Server
echo =========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [INFO] Node.js detected
echo.

REM Check if npm packages are installed
if not exist node_modules (
    echo [INFO] Installing dependencies...
    npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

echo [INFO] Starting local development server...
echo [INFO] Application will be available at: http://localhost:3011
echo [INFO] Press Ctrl+C to stop the server
echo.

REM Start the server
npm start 