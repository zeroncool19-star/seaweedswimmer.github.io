# How to Check Which Keystore is Correct

## The Target SHA1 Fingerprint

Google Play expects this SHA1:
```
5A:E0:F1:A2:52:79:CB:38:E1:E3:1E:D4:6C:0C:40:BC:T9:71:09:00
```

You need to find which of your 4 keystores matches this.

---

## Method 1: Check in Android Studio (Easiest)

### For Each Keystore:

1. Open Android Studio
2. **Build > Generate Signed Bundle / APK**
3. Select **"Android App Bundle"**
4. Click **"Next"**
5. Click **"Choose existing..."**
6. Select one of your keystores (e.g., "KeyStore")
7. Enter the password you used
8. Enter the alias (try: `key0`, `seaweed`, `key`, or whatever you remember)
9. Enter key password

**If passwords are correct:**
- It will let you proceed to next step
- Click **"Next"**
- In the next screen, you'll see certificate info
- **Look for the SHA1 fingerprint**

**Compare it to:** `5A:E0:F1:A2:52:79:CB:38:E1:E3:1E:D4:6C:0C:40:BC:T9:71:09:00`

**If it matches:** ✅ This is the correct keystore!
**If it doesn't match:** Try the next keystore file

---

## Method 2: Using Command Line (Faster)

### Windows:

Open Command Prompt and run for each keystore:

```cmd
cd "C:\path\to\where\you\saved\keystores"

REM Check KeyStore
keytool -list -v -keystore "KeyStore" -alias key0

REM Check Seaweed Swim Key
keytool -list -v -keystore "Seaweed Swim Key" -alias key0

REM Check Key
keytool -list -v -keystore "Key" -alias key0

REM Check Seaweed Key 1
keytool -list -v -keystore "Seaweed Key 1" -alias key0
```

**You'll be asked for password** - enter the password you used when creating it.

**Look for this line in the output:**
```
SHA1: [some fingerprint]
```

**Compare it to:** `5A:E0:F1:A2:52:79:CB:38:E1:E3:1E:D4:6C:0C:40:BC:T9:71:09:00`

### Mac/Linux:

```bash
cd /path/to/where/you/saved/keystores

# Check each one
keytool -list -v -keystore KeyStore -alias key0
keytool -list -v -keystore "Seaweed Swim Key" -alias key0
keytool -list -v -keystore Key -alias key0
keytool -list -v -keystore "Seaweed Key 1" -alias key0
```

---

## Common Aliases to Try

If `key0` doesn't work, try these:
- `key0` (default)
- `seaweed`
- `seaweed-swimmer`
- `seaweedswimmer`
- `my-key-alias`
- `release`
- `key1`
- `upload`

---

## Don't Know the Alias?

To list all aliases in a keystore:

**Windows/Mac/Linux:**
```bash
keytool -list -keystore "KeyStore"
```

Enter password when prompted. It will show:
```
Keystore type: PKCS12
Keystore provider: SUN

Your keystore contains 1 entry

key0, Oct 3, 2024, PrivateKeyEntry,
```

The first word (e.g., `key0`) is your alias!

---

## Quick Comparison Table

Create this table as you check each:

| Keystore File | Password Works? | Alias | SHA1 Match? |
|--------------|----------------|-------|-------------|
| KeyStore | ? | ? | ? |
| Seaweed Swim Key | ? | ? | ? |
| Key | ? | ? | ? |
| Seaweed Key 1 | ? | ? | ? |

**Target SHA1:** `5A:E0:F1:A2:52:79:CB:38:E1:E3:1E:D4:6C:0C:40:BC:T9:71:09:00`

---

## Once You Find the Correct One

When you find which keystore has the matching SHA1:

1. **BACKUP IT IMMEDIATELY** (3 copies minimum)
2. **Save the password securely**
3. **Note the alias name**
4. Use it to sign your `seaweed-swimmer-v13` build
5. Upload to Google Play - it will work! ✅

---

## Tips

💡 **Try the most recent file first**
- "Seaweed Key 1" sounds like it might be your most recent

💡 **Password hints**
- Did you use the same password for all?
- Check your password manager
- Did you write it down anywhere?

💡 **File dates**
- Check which file was created when you first uploaded to Google Play
- That's likely the correct one

---

## Still Can't Find It?

If none of them match:
1. Check if you have other keystore files elsewhere
2. Check email - did you email it to yourself?
3. Check cloud storage backups
4. Check other computers you might have used

---

## Need Help?

Once you check them, tell me:
1. Which keystores you can open (correct password)
2. What aliases they have
3. What SHA1 fingerprints they show

I'll help you determine which is correct!
