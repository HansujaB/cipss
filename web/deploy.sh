#!/bin/bash

# CIPSS Web App Deployment Script
# Run this from the web/ directory

echo "🚀 Starting CIPSS Web App deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the app
echo "🔨 Building the app..."
npm run build

# Deploy to Firebase
echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "🔗 Your app should be live at: https://cipss-platform-b289f.web.app"
