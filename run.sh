#!/bin/bash

# Filosofie Clasa 12 - Interactive Textbook
# Run script for development and deployment

set -e

case "${1:-dev}" in
  dev|start)
    echo "Starting development server..."
    npm run dev
    ;;
  build)
    echo "Building for production..."
    npm run build
    echo "Build complete! Output in ./docs/"
    ;;
  preview)
    echo "Building and previewing production build..."
    npm run build
    npm run preview
    ;;
  install)
    echo "Installing dependencies..."
    npm install
    ;;
  clean)
    echo "Cleaning build artifacts..."
    rm -rf docs node_modules/.vite
    echo "Clean complete!"
    ;;
  *)
    echo "Usage: ./run.sh [command]"
    echo ""
    echo "Commands:"
    echo "  dev      Start development server (default)"
    echo "  build    Build for production (output to ./docs/)"
    echo "  preview  Build and preview production build"
    echo "  install  Install dependencies"
    echo "  clean    Remove build artifacts"
    ;;
esac
