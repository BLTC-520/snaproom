import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LandingScreen } from './src/screens/LandingScreen';
import { ViewerScreen } from './src/screens/ViewerScreen';
import { parseRoomLink, type RoomTarget } from './src/linking';

/**
 * Snaproom AR viewer — root.
 *
 * The app has exactly two states: a landing screen, and a room loaded into a
 * WebView. A room is reached by opening a `snaproom://room?...` deep link
 * (from a scanned QR code) or by pasting one on the landing screen. No auth,
 * no navigation stack — just the two screens.
 */
export default function App() {
  const url = Linking.useURL();
  const [target, setTarget] = useState<RoomTarget | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // React to the launch link and any deep links received while running.
  useEffect(() => {
    if (!url) return;

    const parsed = parseRoomLink(url);
    if (parsed) {
      setTarget(parsed);
      setNotice(null);
    } else if (url.startsWith('snaproom:')) {
      // A Snaproom link arrived but was malformed — surface it on landing.
      setNotice("That link didn't include a room to open. Try scanning again.");
    }
  }, [url]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {target ? (
        <ViewerScreen target={target} onExit={() => setTarget(null)} />
      ) : (
        <LandingScreen
          notice={notice}
          onConnect={(next) => {
            setNotice(null);
            setTarget(next);
          }}
        />
      )}
    </SafeAreaProvider>
  );
}
