# 📱 Make Law Easy — Android APK & Google Play Store Guide

This directory contains the production release artifacts for the **Make Law Easy** Android App (`com.makelaweasy.app`), built for Delhi University LL.B. law students.

---

## 📦 Release Artifacts Overview

| File | Size | Purpose |
| :--- | :--- | :--- |
| **`MakeLawEasy-v1.0.0.apk`** | **4.88 MB** | **Standalone Installable APK**. Transfer to any Android phone (Android 7.0 to Android 15+) and install immediately. |
| **`MakeLawEasy-v1.0.0.aab`** | **4.34 MB** | **Google Play App Bundle**. Required format for uploading to Google Play Console. |
| **`makelaweasy-release.jks`** | **2.8 KB** | **Production Release Keystore**. Used to sign the app. Keep safe for all future app updates. |

---

## 🚀 Part 1: How to Install the APK on Any Android Device (Sideload)

You can share or install `MakeLawEasy-v1.0.0.apk` immediately on any Android phone or tablet:

1. **Transfer the APK**:
   - Send `MakeLawEasy-v1.0.0.apk` via WhatsApp, Telegram, Google Drive, or connect your phone via USB cable and copy it to your `Downloads` folder.
2. **Open & Install**:
   - Tap `MakeLawEasy-v1.0.0.apk` in your phone's File Manager.
   - If prompted by Android, tap **Settings** and enable **"Allow from this source"** (standard security check for sideloaded APKs).
   - Tap **Install**.
3. **Open App**:
   - The app will launch with the golden **Make Law Easy** Scales of Justice logo, splash screen, and full-screen high-performance web view of `https://makelaweasy.in`.
   - Includes pull-to-refresh, hardware acceleration, offline caching, and Android back-gesture navigation.

---

## 🌐 Part 2: How to Publish on the Google Play Store (Future Upload)

Google Play requires the **`.aab` (Android App Bundle)** format for all new apps. Follow these steps when you are ready to publish:

### Step 1: Google Play Console Account
1. Go to [https://play.google.com/console](https://play.google.com/console).
2. Register for a Developer Account (one-time $25 USD registration fee by Google).

### Step 2: Create New App
1. Click **Create app**.
2. **App name**: `Make Law Easy`
3. **Default language**: `English (United States)` or `English (India)`
4. **App or game**: `App`
5. **Free or paid**: `Free`
6. Accept the Developer Program Policies and US export laws, then click **Create app**.

### Step 3: Complete App Content & Policy Declarations
Fill out the standard questionnaire in Google Play Console (Dashboard):
- **Privacy policy**: `https://makelaweasy.in/privacy` *(Already live and compliant with the DPDP Act 2023)*
- **App access**: All functionality is available without special access.
- **Ads**: Select *No, my app does not contain ads*.
- **Content rating**: Complete the questionnaire (Educational app — rated 3+ / Everyone).
- **Target audience**: Select *18 and above* (University LL.B. law students).
- **News apps**: Select *No*.
- **Data safety**: Declare that the app uses network access to connect to `makelaweasy.in` for educational notes and does not sell user data.
- **Government apps**: Select *No* (clarify it is an educational study portal).

### Step 4: Set Up Store Listing
- **App title**: Make Law Easy — DU Law Notes & Precedents
- **Short description**: Complete LL.B. study notes, landmark FIRAC case briefs, and PYQ model answers.
- **Full description**:
  ```text
  Make Law Easy is a dedicated, non-commercial legal education companion for Delhi University LL.B. students.

  Key Features:
  • Exhaustive semester-wise unit dossiers for all LL.B. subjects
  • Structured FIRAC landmark case briefs with factual summaries and ratios
  • Solved previous year examination questions with model answers
  • Rapid Last-Minute Revision capsules for pre-exam recall
  • Offline study caching via modern Service Worker support
  • Fully responsive reading experience with zero horizontal wobble
  • BCI Rule 36 and Copyright Act Fair Dealing compliant educational material
  ```
- **App Icon**: 512 x 512 PNG with the Make Law Easy emblem.
- **Feature Graphic**: 1024 x 500 PNG banner.
- **Screenshots**: 2 to 8 phone screenshots of the app.

### Step 5: Upload the App Bundle
1. Go to **Release** > **Production** (or **Closed testing** / **Internal testing** first).
2. Click **Create new release**.
3. Under **App bundles**, upload `dist-apk/MakeLawEasy-v1.0.0.aab`.
4. **Release name**: `1.0.0`
5. **Release notes**: `Initial release of Make Law Easy for Delhi University law students.`
6. Click **Next** > **Save** > **Review release** > **Start rollout to Production**!

Google's review team typically approves educational apps within 24–48 hours.

---

## 🔑 Part 3: Keystore Credentials (Permanent Reference)

Keep this keystore file and credentials backed up safely. All future updates to Google Play must be signed with this exact keystore:

- **Keystore File**: `dist-apk/makelaweasy-release.jks`
- **Key Alias**: `makelaweasy`
- **Keystore Password**: `makelaweasy123`
- **Key Password**: `makelaweasy123`
- **Validity**: 10,000 Days (Valid until October 2052)
- **Signature Schemes**: APK Signature Scheme v2 + v3

---

## 🛠️ Part 4: How to Build Future App Versions

Whenever you want to build a new version (e.g. `v1.0.1` or `v2.0.0`):

1. Open `android-app/app/build.gradle.kts`.
2. Increment `versionCode` (e.g. from `1` to `2`) and `versionName` (e.g. from `"1.0.0"` to `"1.0.1"`).
3. In PowerShell, run:
   ```powershell
   cd "d:\law notes\android-app"
   .\gradlew.bat assembleRelease   # Builds standalone APK
   .\gradlew.bat bundleRelease     # Builds Play Store AAB
   ```
4. The new files will be generated in `android-app/app/build/outputs/`.
