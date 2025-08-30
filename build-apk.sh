#!/bin/bash
# Seaweed Swimmer - APK Build Script
# Run this script on a machine with Android Studio and Java JDK

set -e

echo "🐠 Building Seaweed Swimmer APK for Google Play Store..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check requirements
echo -e "${BLUE}Checking requirements...${NC}"

if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java JDK not found. Please install Java JDK 11+${NC}"
    exit 1
fi

if ! command -v yarn &> /dev/null && ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Node.js/yarn not found. Please install Node.js and yarn${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Requirements check passed${NC}"

# Set environment variables
export JAVA_HOME=${JAVA_HOME:-$(readlink -f $(which java) | sed "s:bin/java::")}
export ANDROID_HOME=${ANDROID_HOME:-"$HOME/Android/Sdk"}

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
yarn install

echo -e "${YELLOW}🏗️ Building production React app...${NC}"
yarn build

echo -e "${YELLOW}⚡ Syncing Capacitor...${NC}"
npx cap sync android

echo -e "${YELLOW}📱 Building debug APK...${NC}"
cd android
chmod +x ./gradlew
./gradlew assembleDebug

echo -e "${GREEN}🎉 APK built successfully!${NC}"
echo -e "${BLUE}📍 Location: android/app/build/outputs/apk/debug/app-debug.apk${NC}"

# Copy APK to easy location
cp app/build/outputs/apk/debug/app-debug.apk ../seaweed-swimmer-debug.apk

echo -e "${GREEN}📱 APK copied to: seaweed-swimmer-debug.apk${NC}"
echo -e "${BLUE}🚀 Ready for Google Play Store submission!${NC}"

echo ""
echo "📋 Next steps:"
echo "1. Test the APK on a real Android device"
echo "2. Create signed release APK for Play Store"
echo "3. Submit to Google Play Console"
echo ""
echo "🎮 Your Seaweed Swimmer game is ready for the world! 🐠🌊"