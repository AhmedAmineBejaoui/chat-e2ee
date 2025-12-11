#!/bin/bash

# Deployment script for chat-e2ee
# This script helps deploy to Firebase Hosting

set -e

echo "🚀 Chat-E2EE Firebase Deployment Script"
echo "========================================"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found!"
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Check if user is logged in
echo "🔐 Checking Firebase authentication..."
firebase projects:list &> /dev/null || {
    echo "⚠️  Not logged in to Firebase"
    echo "🔑 Opening login..."
    firebase login
}

# Build the service SDK
echo ""
echo "📦 Building service SDK..."
npm run build-service-sdk

# Build the client
echo ""
echo "🏗️  Building client application..."
npm run build-client

# Check if build was successful
if [ ! -d "client/build" ]; then
    echo "❌ Build failed! client/build directory not found"
    exit 1
fi

echo ""
echo "✅ Build completed successfully!"
echo ""

# Ask for confirmation
read -p "🚀 Ready to deploy to Firebase? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying to Firebase Hosting..."
    firebase deploy --only hosting
    
    echo ""
    echo "✅ Deployment complete!"
    echo "🌐 Your app is live at: https://chat-e2ee-7282d.web.app"
    echo ""
else
    echo "❌ Deployment cancelled"
    exit 0
fi
