# M1 — Store-Readiness Audit
**Date:** 2026-06-23  **Auditor:** arbor-native  **Scope:** read-only static audit (no cap sync, no mutations)  
**App repo:** `PPPPtherapy-/PPPPtherapy-` (nested git)  **Base path:** `app/`

---

## 1. Capacitor Config

| Item | Status | Evidence | Fix |
|---|---|---|---|
| `appId` | FIX | `app.arbor.family` — explicit placeholder; comment in file confirms it must be replaced before first submission | `capacitor.config.ts:18` — Guy locks bundle id (Gate G-A), then update here + `project.pbxproj` + `build.gradle` + Appfile default |
| `appName` | PASS | `"Arbor"` | `capacitor.config.ts:19` |
| `webDir` | PASS | `"dist"` | `capacitor.config.ts:20` |
| SplashScreen config | PASS | `launchShowDuration:1200`, `launchAutoHide:true`, `backgroundColor:#eef2efff`, `showSpinner:false`, `androidScaleType:CENTER_CROP`, `splashImmersive:false` — sane for both platforms | `capacitor.config.ts:30-37` |
| StatusBar config | PASS | `style:DARK` (dark icons on light canvas), `backgroundColor:#eef2efff`, `overlaysWebView:false` | `capacitor.config.ts:38-41` |
| iOS `contentInset` | PASS | `"always"` — correct for safe-area handling | `capacitor.config.ts:23` |
| Background color consistency | PASS | `#eef2efff` set at root, ios, android, SplashScreen, StatusBar levels — consistent | `capacitor.config.ts:21,24,27,31,40` |

**Section verdict: 1 FIX (appId placeholder), 6 PASS**

---

## 2. iOS Project

### Info.plist (`app/ios/App/App/Info.plist`)

| Item | Status | Evidence | Fix |
|---|---|---|---|
| `CFBundleDisplayName` | PASS | `"Arbor"` | `Info.plist:10` |
| `CFBundleShortVersionString` | PASS | `$(MARKETING_VERSION)` — resolves to `1.0` per `project.pbxproj:306,328` | `Info.plist:22`; pbxproj lines 306,328 |
| `CFBundleVersion` (build) | PASS | `$(CURRENT_PROJECT_VERSION)` — resolves to `1` per `project.pbxproj:299,321` | `Info.plist:24`; pbxproj lines 299,321 |
| `CFBundleIdentifier` | FIX (linked) | `$(PRODUCT_BUNDLE_IDENTIFIER)` — resolves to `app.arbor.family` (placeholder) at `project.pbxproj:308,329` | Inherits the G-A fix; no separate action |
| `NSCameraUsageDescription` | PASS | Present, meaningful text describing avatar use | `Info.plist:51` |
| `NSMicrophoneUsageDescription` | PASS | Present, meaningful text describing speech practice use | `Info.plist:57` |
| `NSPhotoLibraryUsageDescription` | PASS | Present, meaningful text | `Info.plist:53` |
| `NSPhotoLibraryAddUsageDescription` | PASS | Present, meaningful text | `Info.plist:55` |
| `ITSAppUsesNonExemptEncryption` | FIX | Key absent from Info.plist | Add `<key>ITSAppUsesNonExemptEncryption</key><false/>` if app uses only standard HTTPS (no custom crypto). Required for App Store submission export compliance; omitting it causes review delay/rejection |
| Minimum deployment target | PASS | `IPHONEOS_DEPLOYMENT_TARGET = 15.0` | `project.pbxproj:233,284,301,323` — meets store minimum (iOS 16 is the practical floor but 15 is accepted) |
| `UIViewControllerBasedStatusBarAppearance` | PASS | `<true/>` — required for Capacitor's StatusBar plugin | `Info.plist:49` |
| `UIRequiredDeviceCapabilities` | NOTE | Contains `armv7` — this is the Capacitor default but Apple stopped accepting armv7 for new submissions (iPhone 5s and earlier, no longer in store support). Not a hard block today (Apple silently ignores it on 64-bit builds) but consider removing the array or changing to `arm64` for cleanliness | `Info.plist:33` |

### Shared scheme

| Item | Status | Evidence | Fix |
|---|---|---|---|
| `App.xcscheme` committed | PASS | File present at `app/ios/App/App.xcodeproj/xcshareddata/xcschemes/App.xcscheme`; `buildForArchiving=YES` confirmed | xcscheme line 14 |

**Section verdict: 1 FIX (ITSAppUsesNonExemptEncryption missing), 1 LINKED-FIX (bundle id inherits G-A), 1 NOTE (armv7 capability), 9 PASS**

---

## 3. Android Project

### `app/android/app/build.gradle`

| Item | Status | Evidence | Fix |
|---|---|---|---|
| `applicationId` | FIX (linked) | `"app.arbor.family"` — placeholder, must match final bundle id | `build.gradle:7` — inherits G-A fix |
| `namespace` | PASS | `"app.arbor.family"` — matches applicationId | `build.gradle:4` |
| `versionCode` | PASS | `1` | `build.gradle:10` |
| `versionName` | PASS | `"1.0"` | `build.gradle:11` |
| `minSdkVersion` | PASS | `24` (Android 7.0 / API 24) — via `variables.gradle:2`; covers ~97% of active Android devices | `variables.gradle:2` |
| `targetSdkVersion` | PASS | `36` — via `variables.gradle:4`; meets current Play requirement (targetSdk ≥ 34 enforced since Aug 2024, ≥ 35 from Nov 2024 for new apps; 36 is current and compliant) | `variables.gradle:4` |
| `compileSdkVersion` | PASS | `36` | `variables.gradle:3` |
| `minifyEnabled` release | NOTE | `false` in release build type | `build.gradle:21` — not a store blocker, but enabling R8 shrinking + obfuscation is recommended before production submission |
| `proguardFiles` | PASS | Present alongside `minifyEnabled false`; will activate if minify is turned on | `build.gradle:22` |

### `AndroidManifest.xml`

| Item | Status | Evidence | Fix |
|---|---|---|---|
| `INTERNET` permission | PASS | Present | `AndroidManifest.xml:34` |
| Camera permission | FIX | `CAMERA` not declared in manifest — but Info.plist NSCameraUsageDescription is present on iOS and camera is used for avatar; if the Android feature uses the camera, this permission must be added | `AndroidManifest.xml` — no `uses-permission android:name="android.permission.CAMERA"` found |
| Microphone permission | FIX | `RECORD_AUDIO` not declared — same gap as camera; speech practice feature uses mic | `AndroidManifest.xml` — no `uses-permission android:name="android.permission.RECORD_AUDIO"` found |
| Storage / photo read permission | NOTE | `READ_MEDIA_IMAGES` (Android 13+) / `READ_EXTERNAL_STORAGE` (≤12) not declared — required if avatar image picker accesses gallery | `AndroidManifest.xml` — only `INTERNET` present. Verify whether the Capacitor Camera plugin handles this via its own manifest merge or if it needs explicit declaration |
| App label | PASS | `android:label="@string/app_name"` → resolves to `"Arbor"` | `AndroidManifest.xml:5`; `strings.xml:2` |
| No over-broad permissions | PASS | No `READ_CONTACTS`, `ACCESS_FINE_LOCATION`, `GET_ACCOUNTS`, `PROCESS_OUTGOING_CALLS`, etc. | `AndroidManifest.xml` |
| `android:exported` on main activity | PASS | `android:exported="true"` on the launcher activity as required by API 31+ | `AndroidManifest.xml:16` |
| `supportsRtl` | PASS | `android:supportsRtl="true"` — correct for Hebrew market | `AndroidManifest.xml:8` |

**Section verdict: 2 FIX (CAMERA + RECORD_AUDIO permissions absent), 1 NOTE (storage permission / minify), 6 PASS**

---

## 4. Icons / Splash

### Source art (`app/assets/`)

| Item | Status | Evidence |
|---|---|---|
| `icon-only.svg` | PASS | Present |
| `icon-background.svg` | PASS | Present |
| `icon-foreground.svg` | PASS | Present |
| `splash.svg` | PASS | Present |
| `splash-dark.svg` | PASS | Present |

### iOS generated assets (`app/ios/App/App/Assets.xcassets/`)

| Item | Status | Evidence | Fix |
|---|---|---|---|
| AppIcon.appiconset | FIX | `Contents.json` declares only ONE image: `AppIcon-512@2x.png` (1024x1024 universal) — the actual `AppIcon-512@2x.png` file IS present on disk. This single-image format is the modern "single-size" App Store icon approach (valid since Xcode 14 for iOS 16+). However, the file contains only the one large image with no per-device/per-scale entries. This will build; Apple accepts it. Mark PASS with caveat: confirm PNG is correct Arbor art, not Capacitor default | `Assets.xcassets/AppIcon.appiconset/Contents.json:3-8`; file present at `AppIcon-512@2x.png` |
| Splash images (light) | PASS | `Default@1x/2x/3x~universal~anyany.png` all present | `Splash.imageset/Contents.json:3-17` + files on disk |
| Splash images (dark) | PASS | `Default@1x/2x/3x~universal~anyany-dark.png` all present | `Splash.imageset/Contents.json:18-50` + files on disk |

**iOS icon verdict: PASS with verification needed — confirm `AppIcon-512@2x.png` contains Arbor art, not Capacitor placeholder**

### Android generated assets (`app/android/app/src/main/res/`)

| Item | Status | Evidence | Fix |
|---|---|---|---|
| mipmap PNGs (launcher) | PASS | `ic_launcher.png` present in mdpi/hdpi/xhdpi/xxhdpi/xxxhdpi/ldpi | Glob confirmed |
| mipmap PNGs (round) | PASS | `ic_launcher_round.png` present in mdpi/hdpi/xhdpi/xxhdpi/xxxhdpi/ldpi | Glob confirmed |
| mipmap PNGs (foreground) | PASS | `ic_launcher_foreground.png` present in mdpi/hdpi/xhdpi/xxhdpi/xxxhdpi/ldpi | Glob confirmed |
| mipmap PNGs (background) | PASS | `ic_launcher_background.png` present in mdpi/hdpi/xhdpi/xxhdpi/xxxhdpi/ldpi | Glob confirmed |
| Adaptive icon XML (API 26+) | PASS | `mipmap-anydpi-v26/ic_launcher.xml` + `ic_launcher_round.xml` both present with correct `<adaptive-icon>` structure | `mipmap-anydpi-v26/ic_launcher.xml:1-9` |
| Splash PNGs (portrait + landscape, all densities, light + dark) | PASS | 24 splash drawables present covering port/land × ldpi through xxxhdpi × light/dark | Glob confirmed |
| Foreground/background XML (vector drawable) | FIX — VERIFY | `drawable/ic_launcher_background.xml` contains a generic teal (#26A69A) grid — this is the Capacitor default Android launcher icon, NOT the Arbor Sprout. `drawable-v24/ic_launcher_foreground.xml` contains the generic Android robot/Android default vector. The mipmap PNGs exist but their content is unknown (could also be defaults). Need to verify PNG content is Arbor art | `drawable/ic_launcher_background.xml:7`; `drawable-v24/ic_launcher_foreground.xml` |

**Android icon verdict: FIX — foreground/background XMLs are Capacitor/Android defaults. The mipmap PNGs may or may not be correct — verify. If defaults are present, re-run `npx @capacitor/assets generate` with Arbor SVG sources.**

---

## 5. CI Workflows

### `ios.yml` (`.github/workflows/ios.yml`)

| Item | Status | Evidence | Fix |
|---|---|---|---|
| File present | PASS | Confirmed | `.github/workflows/ios.yml` |
| Runner | PASS | `macos-26` — required for Capacitor 8 / Swift 6.2; comment in file explains why | `ios.yml:28` |
| Xcode 26 selection | PASS | Explicit `xcode-select` step with version detection | `ios.yml:47-51` |
| Node 22 | PASS | `actions/setup-node@v4` with `node-version: 22` | `ios.yml:53-57` |
| Web build → cap sync → native build sequence | PASS | `npm ci` → `npm run build` → `npx cap sync ios` → (signed: fastlane beta) / (unsigned: xcodebuild archive) | `ios.yml:58-103` |
| Signed path (Fastlane) | PASS | Conditional on `ASC_KEY_ID != ''`; runs `bundle install && bundle exec fastlane beta` | `ios.yml:65-77` |
| Unsigned path (compile verify) | PASS | Conditional on `ASC_KEY_ID == ''`; resolves SPM deps then archives with `CODE_SIGNING_ALLOWED=NO` | `ios.yml:79-103` |
| Bundle id from variable | PASS | `IOS_BUNDLE_ID: ${{ vars.IOS_BUNDLE_ID \|\| 'app.arbor.family' }}` — correctly falls back to placeholder | `ios.yml:44` |
| Firebase VITE_* env vars | PASS | All 6 Firebase config values present; noted as public web config, not secrets | `ios.yml:33-39` |
| Trigger paths | PASS | Triggers on `app/**` + the workflow file itself | `ios.yml:18-20` |
| Artifact upload | PASS | Both signed (IPA) and unsigned (archive) paths upload artifacts | `ios.yml:72-77`, `99-103` |

### `android.yml` (`.github/workflows/android.yml`)

| Item | Status | Evidence | Fix |
|---|---|---|---|
| File present | PASS | Confirmed | `.github/workflows/android.yml` |
| Runner | PASS | `ubuntu-latest` — appropriate for Android builds | `android.yml:22` |
| Java 17 | PASS | `actions/setup-java@v4` with `temurin` distribution | `android.yml:43-46` |
| Android SDK setup | PASS | `android-actions/setup-android@v3` | `android.yml:47` |
| Web build → cap sync → Gradle sequence | PASS | `npm ci` → `npm run build` → `npx cap sync android` → `gradlew :app:assembleDebug :app:bundleRelease` | `android.yml:48-57` |
| Release AAB produced | PASS | `:app:bundleRelease` step explicitly builds the AAB | `android.yml:56` |
| Signing secrets path | PASS | Documented in header comment; workflow produces unsigned AAB without secrets, signed with them (wiring is in place for when secrets arrive) | `android.yml:6-10` |
| Firebase VITE_* env vars | PASS | All 6 values present | `android.yml:28-34` |
| Trigger paths | PASS | Triggers on `app/**` + the workflow file itself | `android.yml:18-20` |
| Artifact upload | PASS | Both APK (debug) and AAB (release) uploaded | `android.yml:58-65` |
| gradlew chmod | PASS | `chmod +x ./gradlew` before first Gradle invocation | `android.yml:55` |

**CI section verdict: All PASS — both workflows internally consistent and green-structured**

---

## 6. Version Strategy

| Platform | Current value | Where set | Recommended starting point |
|---|---|---|---|
| iOS marketing version | `1.0` | `project.pbxproj:306,328` (MARKETING_VERSION); surfaced in `Info.plist` via `$(MARKETING_VERSION)` | Use `1.0.0` — Apple accepts either `1.0` or `1.0.0`; `1.0.0` is conventional. Update in Xcode build settings or directly in pbxproj |
| iOS build number | `1` | `project.pbxproj:299,321` (CURRENT_PROJECT_VERSION); surfaced via `$(CURRENT_PROJECT_VERSION)` | Start at `1`; increment by 1 for every TestFlight upload. The workflow does not auto-increment — add a `agvtool new-version -all $GITHUB_RUN_NUMBER` step to ios.yml before archive if auto-increment is desired |
| Android versionName | `"1.0"` | `build.gradle:11` | Use `"1.0.0"` for consistency; not shown to users by Play but good practice |
| Android versionCode | `1` | `build.gradle:10` | Start at `1`; must be strictly incremented for every Play upload. The workflow does not auto-increment — add `-PversionCode=$GITHUB_RUN_NUMBER` to the Gradle invocation in android.yml if auto-increment is desired |

**Version strategy: values are correct for a first submission. Both platforms need a build-number auto-increment strategy wired into CI before sustained production use.**

---

## Ordered Fix List (real gaps only)

| Priority | Fix | Platform | Effort | Gate |
|---|---|---|---|---|
| **F-1** | Lock bundle id — replace `app.arbor.family` placeholder in `capacitor.config.ts`, `project.pbxproj` (2 occurrences each: Debug + Release), `build.gradle`, and `strings.xml` `package_name` | Both | 15 min (after G-A) | Blocked on G-A (Guy) |
| **F-2** | Add `<key>ITSAppUsesNonExemptEncryption</key><false/>` to `Info.plist` | iOS | 2 min | None — do now |
| **F-3** | Add `<uses-permission android:name="android.permission.CAMERA"/>` and `<uses-permission android:name="android.permission.RECORD_AUDIO"/>` to `AndroidManifest.xml` (and verify whether `READ_MEDIA_IMAGES` is also needed for gallery access) | Android | 10 min | None — do now |
| **F-4** | Verify `AppIcon-512@2x.png` (iOS) and all Android mipmap PNGs contain Arbor art — open files visually. The Android vector drawables (`ic_launcher_background.xml` teal fill, `ic_launcher_foreground.xml` robot shape) are confirmed Capacitor/Android defaults and must be regenerated with Arbor SVG sources via `npx @capacitor/assets generate` | Both | `npx @capacitor/assets generate` command (5 min to run after visual confirm); must run from Mac for iOS native sync | Needs cap sync after (no-op here per read-only scope) |
| **F-5** | Wire build-number auto-increment in CI — add `agvtool` step to `ios.yml` and `-PversionCode=$GITHUB_RUN_NUMBER` to `android.yml` so each upload has a unique monotonic build number | Both | 20 min | None — do before first TestFlight/Play upload |

---

## Memory Entry

`2026-06-23 · M1 store-readiness audit complete · 5 fixes identified · Top gaps: F-1 bundle-id (blocked G-A), F-2 iOS export-compliance key, F-3 Android camera/mic permissions, F-4 icon art verification, F-5 CI build-number auto-increment · Both CI workflows internally consistent and green-structured · No signing or account work required to address F-2 through F-5`
