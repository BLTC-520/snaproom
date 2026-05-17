# Snaproom — mobile

The Snaproom AR viewer. Scan the QR code from a finished world on the Snaproom
web app and walk through your space on your phone. No account, no login.

## How it works

1. On desktop, generate a world in Snaproom. When it's done, the viewer shows a
   **View in AR** button → a QR code.
2. Scan the QR with your phone. It opens this app via a `snaproom://` deep link
   carrying the world slug and your computer's network address.
3. The app loads that world's 3D viewer in a WebView and you explore it.

The phone and the computer must be on the **same Wi-Fi network**.

## Setup

```bash
cd mobile
npm install
npx expo start
```

Then either:

- **Expo Go** — fastest for UI work. Scanning the web QR won't route here
  (Expo Go can't claim the `snaproom://` scheme), so on the landing screen
  paste the link shown in the web app's QR modal.
- **Dev build** — `npx expo run:ios` or `npx expo run:android`. This registers
  the `snaproom://` scheme, so scanning the QR with your phone camera opens the
  app directly. This is the real end-to-end experience.

## Scripts

| Command            | What it does            |
| ------------------ | ----------------------- |
| `npm start`        | Expo dev server         |
| `npm run ios`      | Open in iOS simulator   |
| `npm run android`  | Open on Android         |
| `npm run typecheck`| `tsc --noEmit`          |

## Stack

Expo SDK 54 · React Native 0.81 · `react-native-webview` · `expo-linking` ·
`expo-linear-gradient` · `react-native-safe-area-context`.

See [AGENTS.md](./AGENTS.md) for architecture and conventions.
