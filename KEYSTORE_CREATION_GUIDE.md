# Keystore Creation Guide for Seaweed Swimmer

## Keystore Path & Filename

### Recommended Path
Choose a **safe, backed-up location** outside your project folder:

**Windows:**
```
C:\Users\YourName\Documents\AndroidKeystores\seaweed-swimmer-keystore.jks
```

**Mac:**
```
/Users/YourName/Documents/AndroidKeystores/seaweed-swimmer-keystore.jks
```

**Linux:**
```
/home/YourName/Documents/AndroidKeystores/seaweed-swimmer-keystore.jks
```

### Important Notes:
- ⚠️ **DO NOT** store it in your project folder (it could get uploaded to GitHub)
- ✅ **DO** keep it somewhere you regularly backup
- ✅ **DO** consider cloud storage (Google Drive, Dropbox) as backup

---

## Keystore Details to Fill In

When Android Studio asks for these details, here's what to use:

### 1. Keystore Password
- **Recommendation:** Use a strong password (12+ characters)
- **Example:** `SwimmingFish2025!`
- **Important:** Write this down and store it securely!

### 2. Key Alias
- **Recommendation:** Use your app name
- **Example:** `seaweed-swimmer` or `seaweedswimmer`
- **Note:** This identifies your app's key within the keystore

### 3. Key Password
- **Recommendation:** Can be the same as keystore password or different
- **Example:** `SwimmingFish2025!`
- **Important:** Also write this down!

### 4. Validity (years)
- **Recommendation:** `25` or `30` years
- **Why:** Google Play requires 25+ years minimum
- **Note:** This determines how long the key is valid

---

## Certificate Information

### Organization Unit
- **What to use:** Your department or role
- **Examples:**
  - `Game Development`
  - `Mobile Apps`
  - `Independent Developer`

### Organization
- **What to use:** Your company or personal name
- **Examples:**
  - `Your Name Games`
  - `Indie Studios`
  - `Your Full Name`

### City or Locality
- **What to use:** Your city
- **Example:** `London`, `New York`, `Sydney`

### State or Province
- **What to use:** Your state/province
- **Example:** `California`, `Ontario`, `Queensland`

### Country Code (XX)
- **What to use:** Your 2-letter country code
- **Examples:**
  - `US` (United States)
  - `GB` (United Kingdom)
  - `CA` (Canada)
  - `AU` (Australia)
  - `IN` (India)
  - `DE` (Germany)
  - `FR` (France)

---

## Complete Example

Here's a filled-out example:

```
Keystore Path: C:\Users\John\Documents\AndroidKeystores\seaweed-swimmer-keystore.jks
Keystore Password: SwimmingFish2025!
Key Alias: seaweed-swimmer
Key Password: SwimmingFish2025!
Validity: 30 years

Certificate Information:
- First and Last Name: John Smith
- Organizational Unit: Game Development
- Organization: John Smith Games
- City or Locality: San Francisco
- State or Province: California
- Country Code: US
```

---

## Critical - Save This Information!

Create a text file with all your keystore details and save it securely:

```
SEAWEED SWIMMER KEYSTORE INFORMATION
=====================================

Keystore Location: [YOUR PATH]
Keystore Password: [YOUR PASSWORD]
Key Alias: [YOUR ALIAS]
Key Password: [YOUR PASSWORD]
Validity: 30 years

Certificate Details:
- Name: [YOUR NAME]
- Organization Unit: [YOUR UNIT]
- Organization: [YOUR ORG]
- City: [YOUR CITY]
- State: [YOUR STATE]
- Country: [YOUR COUNTRY CODE]

Created Date: [DATE]
```

### Where to Save This:
1. **Password Manager** (1Password, LastPass, Bitwarden) - BEST OPTION
2. **Encrypted file** on your computer
3. **Physical paper** in a safe place
4. **Cloud storage** (Google Drive, Dropbox) - encrypted

⚠️ **WARNING:** If you lose your keystore or passwords, you can NEVER update your app on Google Play! You'll have to publish a completely new app.

---

## Backup Strategy

### Essential Backups:
1. **Primary:** Keep keystore in safe location
2. **Backup 1:** Copy to external hard drive
3. **Backup 2:** Copy to cloud storage
4. **Backup 3:** Copy to USB drive in safe place

### What to Backup:
- ✅ The `.jks` keystore file
- ✅ The password information file
- ✅ Any certificate/SHA fingerprints (for Google Play, AdMob)

---

## After Creating the Keystore

### Get Your SHA-1 Fingerprint (for AdMob, Google Play)

**On Windows:**
```bash
cd C:\Users\YourName\Documents\AndroidKeystores\
keytool -list -v -keystore seaweed-swimmer-keystore.jks -alias seaweed-swimmer
```

**On Mac/Linux:**
```bash
cd ~/Documents/AndroidKeystores/
keytool -list -v -keystore seaweed-swimmer-keystore.jks -alias seaweed-swimmer
```

Enter your keystore password when prompted.

You'll see output like:
```
Certificate fingerprints:
SHA1: A1:B2:C3:D4:E5:F6:...
SHA-256: 1A:2B:3C:4D:5E:6F:...
```

**Save these fingerprints** - you'll need them for:
- Google Play Console
- AdMob configuration
- Firebase (if you add it later)

---

## Quick Reference Checklist

Before building your signed bundle:
- [ ] Keystore file created and saved securely
- [ ] Keystore password written down and backed up
- [ ] Key alias and password written down
- [ ] Keystore file backed up to 3 locations
- [ ] SHA-1 fingerprint obtained and saved
- [ ] Certificate details saved
- [ ] All info stored in password manager or encrypted file

---

## Need Help?

If you get stuck during keystore creation, just let me know at what step and I'll guide you through it!
