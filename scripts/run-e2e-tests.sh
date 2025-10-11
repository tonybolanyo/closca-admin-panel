#!/bin/bash

# E2E Test Runner Script
# This script helps run E2E tests with proper setup

set -e  # Exit on error

echo "🎭 Closca Admin Panel - E2E Test Runner"
echo "========================================"
echo ""

# Check if Playwright is installed
if ! command -v playwright &> /dev/null; then
    echo "❌ Playwright not found. Installing..."
    npm install --save-dev @playwright/test --legacy-peer-deps
fi

# Check if browsers are installed
if [ ! -d "$HOME/.cache/ms-playwright" ]; then
    echo "📦 Installing Playwright browsers..."
    npx playwright install chromium
    echo "✅ Browsers installed"
else
    echo "✅ Playwright browsers already installed"
fi

echo ""
echo "Available commands:"
echo "  1. Run all tests (headless)"
echo "  2. Run tests in UI mode (interactive)"
echo "  3. Run tests with visible browser"
echo "  4. Debug tests"
echo "  5. Show test report"
echo "  6. Exit"
echo ""

read -p "Select option (1-6): " option

case $option in
    1)
        echo ""
        echo "🏃 Running E2E tests..."
        npm run e2e:playwright
        ;;
    2)
        echo ""
        echo "🎨 Opening Playwright UI..."
        npm run e2e:playwright:ui
        ;;
    3)
        echo ""
        echo "👀 Running tests with visible browser..."
        npm run e2e:playwright:headed
        ;;
    4)
        echo ""
        echo "🐛 Opening Playwright debugger..."
        npm run e2e:playwright:debug
        ;;
    5)
        echo ""
        echo "📊 Opening test report..."
        npm run e2e:playwright:report
        ;;
    6)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✅ Done!"
