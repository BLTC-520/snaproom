# AGENTS.md — Snaproom mobile

Expo (React Native, SDK 54) companion app for Snaproom. It opens a generated
world in an AR walk-through. For the desktop pipeline see
[`../AGENTS.md`](../AGENTS.md).

> Expo moves fast — check the versioned docs at
> https://docs.expo.dev/versions/v54.0.0/ before adding native modules.

## What it does

The web app shows a QR code when a world finishes generating. The QR encodes a
deep link:

```
snaproom://room?slug=<world-slug>&host=<lan-ip:port>
```

Scanning it opens this app, which loads the existing web 3D viewer for that
world inside a WebView at `http://<host>/<slug>?embed=1` (`embed=1` strips the
desktop chrome). No auth, no login — two screens only.

## Layout

```
App.tsx                root — deep link in, switches Landing <-> Viewer
src/
  linking.ts           parse snaproom:// links, build the viewer URL
  theme.ts             design tokens (colors, spacing, type)
  components/Logo.tsx  gradient brand mark
  screens/
    LandingScreen.tsx  empty state + manual link entry
    ViewerScreen.tsx   WebView + header + loading/error states
```

## Conventions

- **Two screens, no navigation library.** `App.tsx` holds a single
  `target: RoomTarget | null`. Non-null renders `ViewerScreen`; null renders
  `LandingScreen`. Keep it that way unless a real third screen appears.
- **All deep-link parsing lives in `linking.ts`.** Don't parse URLs in screens.
- **Styling via `theme.ts` tokens** — no ad-hoc hex values in components.
- **The viewer is a WebView**, not native 3D. Rendering changes belong in the
  web app (`../app`), not here.

## Run it

```
npm install
npx expo start
```

- **Expo Go** runs the UI, but the custom `snaproom://` scheme only routes to a
  dev/production build. In Expo Go, test by pasting a link on the landing
  screen (the web QR modal shows the exact link to copy).
- **Dev build** (`npx expo run:ios` / `run:android`) registers `snaproom://`,
  so scanning the QR with the phone camera opens the app directly.
- The phone and the computer running the Snaproom web app must be on the same
  Wi-Fi network. The web dev server binds to the LAN (`vite server.host`).

## Connectivity notes

- `app.json` sets `ios.infoPlist.NSAppTransportSecurity.NSAllowsLocalNetworking`
  and `android.usesCleartextTraffic` so the WebView can load the `http://` LAN
  dev server. Keep these when editing `app.json`.
