@echo off
echo 🚀 WeZZard Blog - Quick Start Setup (Windows)
echo =============================================

echo 📋 Checking prerequisites...

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js detected: %NODE_VERSION%

:: Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm detected: %NPM_VERSION%

echo.
echo 📦 Installing dependencies...
echo    This may take a few minutes...

:: Install dependencies
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies. Try:
    echo    npm cache clean --force
    echo    rmdir /s node_modules
    echo    del package-lock.json
    echo    npm install
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully!

echo.
echo 🔍 Checking TypeScript compilation...

:: Type check
npm run type-check

if %errorlevel% neq 0 (
    echo ⚠️  TypeScript errors detected. Check the output above.
) else (
    echo ✅ TypeScript compilation successful!
)

echo.
echo 🎉 Setup complete! Next steps:
echo.
echo 1. Start development server:
echo    npm run develop
echo.
echo 2. Open your browser to:
echo    http://localhost:8000
echo.
echo 3. Edit content in:
echo    content\posts\     (for blog posts)
echo    content\pages\     (for static pages)
echo.
echo 4. For help, see:
echo    LOCAL_SETUP_GUIDE.md
echo.
echo Happy blogging! 🎉
pause