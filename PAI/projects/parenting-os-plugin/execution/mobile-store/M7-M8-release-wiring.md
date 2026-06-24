# M7 + M8 — Signing Dry-Run & CORS Verify
**Date:** 2026-06-23 · **Owner:** arbor-release · **Status:** COMPLETE (account-free analysis)
**Note:** This file covers both M7 (secret-wiring handover) and M8 (CORS verify). Canonical path: `execution/mobile-store/M7-M8-release-wiring.md`

---

## M7-iOS — Secret/Variable Table

| Name | Kind | What it is | Exact generation command | Consuming file:line |
| :--- | :--- | :--- | :--- | :--- |
| `ASC_KEY_ID` | Secret | App Store Connect API key ID (10-char alphanumeric) | ASC > Users and Access > Integrations > App Store Connect API > create key (App Manager role) > copy Key ID | `.github/workflows/ios.yml:41`; `app/ios/App/fastlane/Fastfile:16` |
| `ASC_ISSUER_ID` | Secret | ASC team issuer UUID (same Integrations page) | Copy Issuer ID from same ASC page | `.github/workflows/ios.yml:42`; `Fastfile:17` |
| `ASC_KEY_CONTENT` | Secret | `.p8` private key, base64-encoded | Download `.p8` from ASC (one-time, lost after dialog closes), then: `base64 -w0 AuthKey_XXXXXXXX.p8` | `.github/workflows/ios.yml:43`; `Fastfile:18` (flag `is_key_content_base64: true`) |
| `IOS_BUNDLE_ID` | Repo variable | Registered bundle identifier — must match `capacitor.config.ts` appId | Guy sets after G-A lock. Current fallback: `app.arbor.family` (hardcoded at `ios.yml:44` and `Fastfile:22`) | `.github/workflows/ios.yml:44`; `Fastfile:22` |

### iOS end-to-end first-signed-build sequence

1. G-A: lock bundle ID in `capacitor.config.ts`; set repo variable `IOS_BUNDLE_ID` to match.
2. G-B Apple: enroll Apple Developer Program ($99/yr); create app record in ASC with that bundle ID.
3. Set three repo secrets: `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_CONTENT`.
4. Push any change to `app/**` on `main` or trigger "iOS build" manually via Actions tab.
5. `ios.yml` runner `macos-26` (Xcode 26 / Swift 6.2 -- required by Capacitor 8 SPM plugins, `ios.yml:28`):
   - `npm ci` -> `npm run build` -> `npx cap sync ios`
   - Gate `if: env.ASC_KEY_ID != ''` (`ios.yml:66`) -- secrets present -> signed path.
   - `bundle install && bundle exec fastlane beta` (`ios.yml:70`)
   - Fastlane `beta` lane (`Fastfile:12-41`): `setup_ci` -> `app_store_connect_api_key` -> `cert` + `sigh` -> `build_app` -> `upload_to_testflight(skip_waiting_for_build_processing: true)`.
6. Artifact: signed `Arbor.ipa` uploaded to TestFlight automatically; also saved as GitHub artifact `arbor-ios-ipa` (`ios.yml:72-77`).
7. Promote TestFlight build -> App Store review inside App Store Connect (no further CI action needed).

**No-secrets fallback:** unsigned Xcode archive via `xcodebuild CODE_SIGNING_ALLOWED=NO` (`ios.yml:80-103`), saved as `arbor-ios-archive`. Compile verification only; not submittable to App Store.

---

## M7-Android — Secret/Variable Table

| Name | Kind | What it is | Exact generation command | Consuming file:line |
| :--- | :--- | :--- | :--- | :--- |
| `ANDROID_KEYSTORE_BASE64` | Secret | Upload keystore, base64-encoded | `keytool -genkey -v -keystore upload.keystore -alias arbor -keyalg RSA -keysize 2048 -validity 10000` then `base64 -w0 upload.keystore` | NOT WIRED in `android.yml` -- see GAP-1 |
| `ANDROID_KEYSTORE_PASSWORD` | Secret | Password chosen during `keytool -genkey` | Set interactively during keytool invocation | NOT WIRED |
| `ANDROID_KEY_ALIAS` | Secret | Key alias (`arbor` per keytool command above) | `-alias` value in keytool command | NOT WIRED |
| `ANDROID_KEY_PASSWORD` | Secret | Key password (may equal keystore password) | Set during keytool invocation | NOT WIRED |

### Android end-to-end first-signed-build sequence

1. G-A: bundle ID hardcoded in `app/android/app/build.gradle:6` as `app.arbor.family` -- matches `capacitor.config.ts` placeholder. Update both after G-A lock and re-run `npx cap sync`.
2. G-B Google: Play Console ($25 one-time), create app listing, enable Play App Signing (required for AAB upload).
3. Generate upload keystore: `keytool -genkey -v -keystore upload.keystore -alias arbor -keyalg RSA -keysize 2048 -validity 10000`. Store file + passwords in password manager immediately.
4. Base64-encode: `base64 -w0 upload.keystore`. Store the result as the `ANDROID_KEYSTORE_BASE64` secret value.
5. Add four repo secrets AND wire them into `android.yml` (GAP-1 fix -- write now, before G-B).
6. Push to `main` or trigger "Android build" manually.
7. `android.yml` runner `ubuntu-latest`: `npm ci` -> `npm run build` -> `npx cap sync android` -> `./gradlew :app:assembleDebug :app:bundleRelease` (`android.yml:56`).
8. Artifact: signed release AAB at `app/android/app/build/outputs/bundle/release/*.aab`, uploaded as `arbor-android` (`android.yml:60-64`).
9. Upload signed AAB to Play Console -> internal-testing track. Play App Signing re-signs with the distribution key.

**Current state without secrets:** `android.yml` Gradle step produces an UNSIGNED AAB. The `release` buildType in `app/android/app/build.gradle:19-23` has no `signingConfig` block. Unsigned AABs are rejected by Play Console.

---

## M8 — Backend CORS / Native-Origin Verify

**Source of truth:** `app/src/config/env.ts:95-105`

`loadConfig()` builds `corsOrigins` by taking `CORS_ORIGINS` env var and unconditionally appending two hardcoded entries:

- `"capacitor://localhost"` -- iOS webview origin (`env.ts:103`)
- `"https://localhost"` -- Android webview origin, androidScheme:https (`env.ts:104`)

These are code constants, not env vars -- always included regardless of `CORS_ORIGINS` value.

**Current prod Cloud Run deploy** (`cloudbuild.prod.yaml:51`) sets:
```
CORS_ORIGINS=https://arborprd-westeu.web.app,https://arborprd-westeu.firebaseapp.com
```
At runtime `loadConfig()` appends the native origins on top. The computed `corsOrigins` array includes all four. Code logic is correct.

**Unknown:** whether the currently-running `arbor-api` Cloud Run image was built from a version of `env.ts` that includes lines 103-104. If the prod image predates these lines, native apps will receive CORS rejections on every `/api/*` call.

**Status: CODE-CORRECT in source. Prod image currency unverified. A backend redeploy is REQUIRED before any native build can be tested against prod API.**

**Gated redeploy command (Level 3 -- require Guy confirmation; coordinate with any active Firebase Hosting deploy):**
```
gcloud builds submit --config cloudbuild.prod.yaml --project arborprd-westeu
```
Run from `C:/Users/dguyr/ROS/PPPPtherapy-/PPPPtherapy-/` (the nested app repo root, not ROS root).

---

## GAPS -- Mismatches Between MOBILE.md and Actual Wiring

### GAP-1 (CRITICAL -- blocks first Play upload): Android signing not wired in `android.yml`

`MOBILE.md:76-77` and the goal doc (G-B deliverables section) both list four Android signing secrets (`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, `ANDROID_KEY_PASSWORD`). In `android.yml` they appear only in the header comment (lines 7-9) -- never as `${{ secrets.* }}` references. There is no keystore decode step and no signing step anywhere in the workflow. The `release` buildType in `app/android/app/build.gradle:19-23` has no `signingConfig`.

This is account-free to fix now (no keys needed to write the code). The following steps should be added to `android.yml` after the Gradle build step:

```yaml
- name: Decode keystore
  if: env.ANDROID_KEYSTORE_BASE64 != ''
  env:
    ANDROID_KEYSTORE_BASE64: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}
  run: echo "$ANDROID_KEYSTORE_BASE64" | base64 --decode > app/android/upload.keystore

- name: Sign release AAB
  if: env.ANDROID_KEYSTORE_BASE64 != ''
  env:
    ANDROID_KEYSTORE_PASSWORD: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
    ANDROID_KEY_ALIAS: ${{ secrets.ANDROID_KEY_ALIAS }}
    ANDROID_KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD }}
  working-directory: app
  run: |
    jarsigner -verbose \
      -sigalg SHA256withRSA -digestalg SHA-256 \
      -keystore android/upload.keystore \
      -storepass "$ANDROID_KEYSTORE_PASSWORD" \
      -keypass "$ANDROID_KEY_PASSWORD" \
      android/app/build/outputs/bundle/release/app-release.aab \
      "$ANDROID_KEY_ALIAS"
```

This mirrors the iOS pattern exactly: when secrets absent the build remains unsigned (green compile), when secrets present it signs and the AAB is Play-uploadable.

### GAP-2 (MINOR): Placeholder file superseded

The original `M7-secret-wiring-runbook.md` contained only `PLACEHOLDER`. This file is the authoritative M7+M8 output.

### GAP-3 (ACTION REQUIRED before first native-vs-prod test): CORS redeploy timing unknown

Whether the live `arbor-api` Cloud Run image includes `env.ts:103-104` is unverifiable from files alone. Schedule the `cloudbuild.prod.yaml` redeploy (Level 3 gated) before any TestFlight or Play internal-track test against prod.

---

## Pre-G-B Checklist

- [ ] G-A: lock `appId` in `capacitor.config.ts` (currently placeholder `app.arbor.family`) and set repo variable `IOS_BUNDLE_ID`
- [ ] Fix GAP-1: write Android signing steps into `android.yml` (account-free -- write before G-B, not after)
- [ ] Schedule M8 CORS redeploy (`cloudbuild.prod.yaml` -- Level 3 gated; coordinate with active hosting session before native test)
- [ ] G-B Apple: enroll + create ASC API key (App Manager role) + create app record -> set 3 secrets + 1 variable
- [ ] G-B Google: enroll Play Console + generate upload keystore -> set 4 secrets
- [ ] Trigger iOS workflow -> confirm signed IPA appears in TestFlight
- [ ] Trigger Android workflow -> upload signed AAB to Play Console internal-testing track