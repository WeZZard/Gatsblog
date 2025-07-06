#!/bin/bash

# WeZZard Blog - Quick Start Script
echo "🚀 WeZZard Blog - Quick Start Setup"
echo "=================================="

# Check Node.js version
echo "📋 Checking prerequisites..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js detected: $NODE_VERSION"
    
    # Extract major version number
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | cut -d'v' -f2)
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        echo "⚠️  Warning: Node.js 18+ recommended. Current: $NODE_VERSION"
        echo "   Download from: https://nodejs.org/"
    fi
else
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm detected: $NPM_VERSION"
else
    echo "❌ npm not found. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."
echo "   This may take a few minutes..."

# Install dependencies
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Try:"
    echo "   npm cache clean --force"
    echo "   rm -rf node_modules package-lock.json"
    echo "   npm install"
    exit 1
fi

echo ""
echo "🔍 Checking TypeScript compilation..."

# Type check
npm run type-check

if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful!"
else
    echo "⚠️  TypeScript errors detected. Check the output above."
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Start development server:"
echo "   npm run develop"
echo ""
echo "2. Open your browser to:"
echo "   http://localhost:8000"
echo ""
echo "3. Edit content in:"
echo "   content/posts/     (for blog posts)"
echo "   content/pages/     (for static pages)"
echo ""
echo "4. For help, see:"
echo "   LOCAL_SETUP_GUIDE.md"
echo ""
echo "Happy blogging! 🎉"