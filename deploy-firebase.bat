@echo off
REM Deployment script for chat-e2ee on Windows
REM This script helps deploy to Firebase Hosting

echo.
echo ========================================
echo   Chat-E2EE Firebase Deployment Script
echo ========================================
echo.

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if errorlevel 1 (
    echo Firebase CLI not found!
    echo Installing Firebase CLI...
    call npm install -g firebase-tools
)

REM Check if user is logged in
echo Checking Firebase authentication...
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo Not logged in to Firebase
    echo Opening login...
    call firebase login
)

REM Build the service SDK
echo.
echo Building service SDK...
call npm run build-service-sdk
if errorlevel 1 (
    echo Build service SDK failed!
    exit /b 1
)

REM Build the client
echo.
echo Building client application...
call npm run build-client
if errorlevel 1 (
    echo Build client failed!
    exit /b 1
)

REM Check if build was successful
if not exist "client\build" (
    echo Build failed! client\build directory not found
    exit /b 1
)

echo.
echo Build completed successfully!
echo.

REM Ask for confirmation
set /p CONFIRM="Ready to deploy to Firebase? (y/n): "
if /i "%CONFIRM%"=="y" (
    echo Deploying to Firebase Hosting...
    call firebase deploy --only hosting
    
    echo.
    echo ========================================
    echo   Deployment complete!
    echo   Your app is live at:
    echo   https://chat-e2ee-7282d.web.app
    echo ========================================
    echo.
) else (
    echo Deployment cancelled
    exit /b 0
)
