# Android Studio Build Instructions - Seaweed Swimmer

## The Issue
You're seeing "Failed to resolve: project:capacitor-*" errors because the Capacitor plugin modules weren't included in the original export.

## Solution: Use the New Export

I've created a new export that includes all Capacitor plugin modules:
**File:** `seaweed-swimmer-final-v10-with-plugins.zip` (3.7 MB)

---

## Build Instructions

### Step 1: Extract the New Zip
1. Extract `seaweed-swimmer-final-v10-with-plugins.zip`
2. You should see this structure:
   ```
   frontend/
   ├── android/              (Android Studio project)
   ├── build/                (React build)
   ├── node_modules/         (Capacitor plugins only)
   │   ├── @capacitor/
   │   └── @capacitor-community/
   ├── src/
   ├── public/
   └── capacitor.config.json
   ```

### Step 2: Open in Android Studio
1. Open Android Studio
2. Click "Open"
3. Navigate to and select the `frontend/android` folder (NOT the frontend folder)
4. Click "OK"

### Step 3: Wait for Gradle Sync
1. Android Studio will automatically run a Gradle sync
2. This may take a few minutes the first time
3. Watch the bottom status bar for progress

### Step 4: Verify Dependencies
After Gradle sync completes, the errors should be gone. You should see:
```
✅ project:capacitor-android
✅ project:capacitor-community-admob
✅ project:capacitor-haptics
✅ project:capacitor-splash-screen
✅ project:capacitor-status-bar
```

---

## If Errors Persist

### Option A: Clean and Rebuild
1. In Android Studio: **Build > Clean Project**
2. Wait for it to complete
3. Then: **Build > Rebuild Project**

### Option B: Invalidate Caches
1. **File > Invalidate Caches / Restart...**
2. Select "Invalidate and Restart"
3. Wait for Android Studio to restart
4. Let Gradle sync again

### Option C: Check settings.gradle
Open `frontend/android/settings.gradle` and verify it includes:
```gradle
include ':capacitor-android'
project(':capacitor-android').projectDir = new File('../node_modules/@capacitor/android/capacitor')

include ':capacitor-community-admob'
project(':capacitor-community-admob').projectDir = new File('../node_modules/@capacitor-community/admob/android')

// ... other plugins
```

---

## Building the Release AAB

Once dependencies are resolved:

### Step 1: Generate Signed Bundle
1. **Build > Generate Signed Bundle / APK**
2. Select **"Android App Bundle"**
3. Click **Next**

### Step 2: Create or Select Keystore
**If you have an existing keystore:**
- Click "Choose existing..."
- Select your keystore file
- Enter keystore password
- Select your key alias
- Enter key password

**If you need to create a new keystore:**
- Click "Create new..."
- Choose a location and filename
- Set passwords
- Fill in certificate information
- Click "OK"

### Step 3: Build Configuration
1. Select **"release"** build variant
2. Check both signature versions (V1 and V2)
3. Click **Next**
4. Choose the destination folder
5. Click **Finish**

### Step 4: Locate Your AAB
Once the build completes, you'll find the AAB at:
```
frontend/android/app/build/outputs/bundle/release/app-release.aab
```

This is the file you'll upload to Google Play Console!

---

## Important Notes

### Version Code
The current version code is **10**. If you've already uploaded version 10 to Google Play, you'll need to increment it:

1. Open `frontend/android/app/build.gradle`
2. Find the line: `versionCode 10`
3. Change it to: `versionCode 11`
4. Save and rebuild

### AdMob App ID
Make sure you have your AdMob App ID configured in:
`frontend/android/app/src/main/AndroidManifest.xml`

Look for:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="YOUR_ADMOB_APP_ID_HERE"/>
```

Replace `YOUR_ADMOB_APP_ID_HERE` with your actual AdMob App ID before building for production.

---

## Troubleshooting

### Build Failed - JDK Version
If you get JDK version errors:
1. **File > Project Structure**
2. Set **Gradle JDK** to Java 17 or 21
3. Click **Apply** and **OK**
4. Sync project again

### Build Failed - SDK Location
If you get "SDK location not found":
1. **File > Project Structure**
2. Set **Android SDK Location** to your SDK path
3. Usually: `C:\Users\YourName\AppData\Local\Android\Sdk` (Windows)
4. Or: `/Users/YourName/Library/Android/sdk` (Mac)

### Dependencies Still Failing
If Capacitor dependencies still fail:
1. Close Android Studio
2. Delete the following folders:
   - `frontend/android/.gradle`
   - `frontend/android/.idea`
   - `frontend/android/build`
3. Reopen Android Studio
4. Let it rebuild everything

---

## Success Checklist

Before uploading to Google Play, verify:
- ✅ App builds successfully without errors
- ✅ Version code is correct and incremented
- ✅ Keystore is backed up safely
- ✅ AdMob App ID is configured
- ✅ App installs and runs on a test device
- ✅ "Tap to Start" functionality works
- ✅ Gameplay is smooth
- ✅ Score tracking works
- ✅ Game Over screen appears correctly

---

## Need Help?
If you encounter any issues not covered here, let me know the specific error message and I'll help you resolve it!
