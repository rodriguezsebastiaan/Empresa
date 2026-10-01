# Step 5C — Physical-device validation

Date: 2026-10-01

## Device availability

This Windows host has no physical mobile browser session available for this run.

### ADB setup and device detection

- The two earlier Step 5C attempts stopped because `adb` was unavailable. This run installed Google's standalone Android Platform Tools 37.0.1 under the user profile, without Android Studio or a global PATH change.
- **ADB path:** `C:\Users\juanm\Tools\android-platform-tools\platform-tools\adb.exe`.
- `adb version` passed (Android Debug Bridge 1.0.41, version 37.0.1-15733141). `adb kill-server` found no active daemon; `adb start-server` then started it successfully.
- `adb devices -l` returned only `List of devices attached`; no serial or device state was present. The reported phone therefore could not be selected or classified as `device`, `unauthorized` or `offline`.
- Windows present-device enumeration showed no Android, ADB or MTP/portable device. Connected USB enumeration showed USB hubs/controllers and other peripherals only; Windows is not currently exposing a phone interface. This does not establish whether the phone is plugged into another port, using a charge-only cable, or has USB debugging enabled.
- No emulated Step 5B QA was repeated.

- **Android / Chrome:** No Android device model, Android version, Chrome version or physical viewport can be recorded until ADB detects the phone.
- **iPhone/iPad / Safari:** `idevice_id` and `iproxy` are not installed or on PATH, no Apple mobile device appeared in the present-device inventory, and this host has no Safari Web Inspector connection. There is no iPhone/iPad model, iOS/Safari version or physical viewport to record.

No physical-device test is claimed. Step 5B's desktop and mobile viewport emulation remains the available prior evidence; it does not certify touch, native media policy, dynamic browser chrome, safe-area behavior, thermal response or physical reduced-motion settings.

## Results and changes

ADB is now available, but the Android device is absent from both ADB and Windows device enumeration. Android Chrome and iOS Safari test phases could not be run. There are no physical-device observations about the native intro, touch/flick response, frame gaps, orientation changes, dynamic viewport, cellular playback, soft keyboards, reduced motion, sustained use or VoiceOver/TalkBack. No device-specific defect was confirmed and no production source was changed. Static suites were not rerun because this step made no code changes; the passing Step 5B results remain the latest regression/build evidence.

### Android connection action needed

Reconnect the phone with a known data-capable USB cable, unlock it, choose **File Transfer / Android Auto** (or the equivalent data mode), and confirm **USB debugging** is enabled in Developer options. Then reply when that is done; the next check can reuse the installed ADB and continue from `adb devices -l`. If the phone appears as `unauthorized`, accept its RSA debugging prompt and reply.

## Manual device checklist

Run each checklist on a real device before closing Step 5C. Use a fresh browser session; record model, OS/browser version, viewport, orientation and network type. Do not submit real forms or bookings.

### Android Chrome

- Fresh-load Inicio on Wi-Fi; record muted inline video0 startup, intro completion, Hero handoff and any stalls or black frames.
- Repeat on cellular if practical, noting that one network sample is qualitative.
- Use touch to scroll slowly forward, flick quickly, reverse through the full sequence, reverse around at least three boundaries and stop inside a crossfade. Check for scroll lock, delayed catch-up, stale frames and gaps.
- Interrupt the intro with a real touch scroll and verify manual control takes over without an intro restart.
- Rotate portrait ↔ landscape. Confirm the source changes at the 767 px breakpoint, the displayed frame stays ready and no source hold remains.
- Open/close the mobile menu repeatedly; navigate primary routes and use Back/Forward.
- Check Nosotros, Soluciones, Servicios, Proceso and Contacto video scrubbing and readability; open `/nosotros#proyectos` and all five project details.
- Use the mobile keyboard for invalid Contacto email/required fields and advisory required fields. Confirm active fields remain visible; do not submit valid data.
- Enable Android's reduced-motion preference and reload. Confirm the intro is skipped/simplified and content/navigation remain usable; restore the preference.
- Keep Inicio open for several minutes with repeated forward/reverse touch scroll; note visible responsiveness loss, media lockups, tab reloads or obvious heat without claiming measured thermal data.

### iPhone/iPad Safari

- Fresh-load Inicio on Wi-Fi; verify video0 plays muted and inline without fullscreen takeover, then record intro completion, Hero handoff and visible stalls or frame artifacts.
- Repeat on cellular if practical, noting that one network sample is qualitative.
- Use finger touch for slow forward, rapid flick, full reverse, three boundary reversals and a stop inside a crossfade. Verify video direction follows touch and scrolling is never hijacked.
- Interrupt the intro using touch and confirm it does not restart.
- Rotate portrait ↔ landscape and expand/collapse Safari's address/tool bars. Check cinematic alignment, dynamic viewport jumps, fixed header, safe areas and source selection across the 767 px breakpoint.
- Open/close the mobile menu, navigate primary routes, and check Back/Forward.
- Check all five internal pages, the portfolio anchor/cards and project detail pages; watch for Safari-only media flashes or layout shifts.
- Exercise native email/date controls and required-field validation using the soft keyboard. Check that focus and scroll positioning keep the active field visible; do not send a real form or appointment.
- Enable Reduce Motion, reload and verify the reduced-motion path and content usability; restore the setting.
- If Safari Web Inspector is available, record console/media errors. Keep the page open for several minutes and note qualitative responsiveness or media failures without claiming thermal telemetry.

## Step 5D release gate

**NO-GO for Step 5D production release validation for this run:** ADB setup succeeded, but no real Android device could be controlled after Windows USB troubleshooting checks. Step 5C physical behavior remains unverified; this is not an application defect. Continue Android testing when the phone enumerates, and keep iOS Safari pending until a real Safari device/debugging path is available.
