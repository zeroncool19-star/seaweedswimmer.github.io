#!/bin/bash

# Seaweed Swimmer GitHub Pages Deployment Script
# This script helps you deploy your website to GitHub Pages

echo "🐠 Seaweed Swimmer - GitHub Pages Deployment"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the github-pages directory"
    echo "   Run: cd /app/github-pages"
    exit 1
fi

# Ask for GitHub username
echo "Please enter your GitHub username:"
read -p "Username: " github_username

if [ -z "$github_username" ]; then
    echo "❌ Error: GitHub username cannot be empty"
    exit 1
fi

echo ""
echo "📦 Initializing git repository..."
git init

echo "📝 Adding files..."
git add .

echo "💾 Creating commit..."
git commit -m "Initial commit - Seaweed Swimmer website with app-ads.txt"

echo "🔗 Connecting to GitHub repository..."
git remote add origin "https://github.com/${github_username}/seaweedswimmer.github.io.git"

echo "🌿 Setting branch to main..."
git branch -M main

echo ""
echo "🚀 Ready to push to GitHub!"
echo ""
echo "⚠️  IMPORTANT: You'll need to authenticate with GitHub"
echo "   Use your Personal Access Token (NOT your password)"
echo ""
echo "To create a token:"
echo "   1. Go to: https://github.com/settings/tokens"
echo "   2. Generate new token (classic)"
echo "   3. Select 'repo' scope"
echo "   4. Use the token as your password"
echo ""
read -p "Press Enter to continue with push..."

echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Your website has been deployed!"
    echo ""
    echo "🌐 Your website will be available at:"
    echo "   https://${github_username}.github.io"
    echo ""
    echo "📄 Your app-ads.txt will be at:"
    echo "   https://${github_username}.github.io/app-ads.txt"
    echo ""
    echo "⏰ Note: It may take 1-2 minutes for the site to go live"
    echo ""
    echo "📱 Next steps:"
    echo "   1. Wait 2 minutes, then visit your site"
    echo "   2. Verify app-ads.txt is accessible"
    echo "   3. Add the website URL to your Google Play Store listing"
    echo "   4. Wait 24 hours for AdMob to verify"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "   1. Your GitHub username is correct"
    echo "   2. The repository exists at github.com/${github_username}/seaweedswimmer.github.io"
    echo "   3. You're using a Personal Access Token (not password)"
    echo ""
    echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
fi
