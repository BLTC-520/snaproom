import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from '../components/Logo';
import { viewerUrl, type RoomTarget } from '../linking';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  /** Room to load into the WebView. */
  target: RoomTarget;
  /** Return to the landing screen. */
  onExit: () => void;
}

/** "sunlit-bedroom" -> "Sunlit Bedroom" for the header title. */
function humanizeSlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function ViewerScreen({ target, onExit }: Props) {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  const uri = viewerUrl(target);
  const title = humanizeSlug(target.slug);

  const reload = () => {
    setErrored(false);
    setLoading(true);
    webViewRef.current?.reload();
  };

  return (
    <View style={styles.flex}>
      <WebView
        ref={webViewRef}
        source={{ uri }}
        originWhitelist={['*']}
        style={styles.webview}
        containerStyle={styles.webview}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => setErrored(true)}
        // A failed status on the top-level document means the room is
        // unreachable; sub-resource hiccups should not blank the screen.
        onHttpError={(event) => {
          if (event.nativeEvent.url === uri) setErrored(true);
        }}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        allowsBackForwardNavigationGestures={false}
        bounces={false}
        overScrollMode="never"
      />

      {/* Floating header — overlays the chrome-free embedded viewer. */}
      <View style={[styles.header, { top: insets.top + spacing.sm }]}>
        <Pressable
          onPress={onExit}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Text style={styles.iconGlyph}>‹</Text>
        </Pressable>

        <View style={styles.titlePill}>
          <Logo size={18} />
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <Pressable
          onPress={reload}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Text style={[styles.iconGlyph, styles.reloadGlyph]}>⟳</Text>
        </Pressable>
      </View>

      {/* Loading veil */}
      {loading && !errored ? (
        <View style={styles.overlay} pointerEvents="none">
          <Logo size={56} />
          <ActivityIndicator color={colors.accentBright} style={styles.spinner} />
          <Text style={styles.overlayTitle}>Entering your world…</Text>
          <Text style={styles.overlayBody}>{title}</Text>
        </View>
      ) : null}

      {/* Error state */}
      {errored ? (
        <View style={styles.overlay}>
          <Text style={styles.errorTitle}>Couldn't reach this room</Text>
          <Text style={styles.overlayBody}>
            Make sure Snaproom is running on your computer and your phone is on
            the same Wi-Fi network.
          </Text>
          <Text style={styles.errorHost}>{uri}</Text>
          <View style={styles.errorActions}>
            <Pressable
              onPress={reload}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.primaryButtonText}>Try again</Text>
            </Pressable>
            <Pressable
              onPress={onExit}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.secondaryButtonText}>Back</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const GLASS = 'rgba(14,18,28,0.82)';

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  webview: { flex: 1, backgroundColor: colors.background },

  header: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: GLASS,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: { color: colors.textPrimary, fontSize: 26, lineHeight: 28, marginTop: -2 },
  reloadGlyph: { fontSize: 18 },
  pressed: { opacity: 0.7 },
  titlePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: GLASS,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  titleText: { ...typography.label, color: colors.textPrimary, flexShrink: 1 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  spinner: { marginTop: spacing.md },
  overlayTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  overlayBody: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  errorTitle: { ...typography.title, color: colors.textPrimary },
  errorHost: { ...typography.mono, color: colors.textMuted, marginTop: spacing.xs },
  errorActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  primaryButtonText: { color: colors.textPrimary, fontWeight: '700', fontSize: 15 },
  secondaryButton: {
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  secondaryButtonText: { color: colors.textPrimary, fontWeight: '600', fontSize: 15 },
});
