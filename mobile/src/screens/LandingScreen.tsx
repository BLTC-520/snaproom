import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from '../components/Logo';
import { parseRoomLink, type RoomTarget } from '../linking';
import { accentGradient, colors, radius, spacing, typography } from '../theme';

interface Props {
  /** Called once a valid room target is resolved (scan or manual entry). */
  onConnect: (target: RoomTarget) => void;
  /** Message shown when an inbound link could not be opened. */
  notice?: string | null;
}

const STEPS = [
  {
    title: 'Generate a world',
    body: 'Open Snaproom on desktop and turn a photo or floor plan into a 3D room.',
  },
  {
    title: 'Scan the QR code',
    body: 'When the world is ready, Snaproom shows a QR code. Point your camera at it.',
  },
  {
    title: 'Walk through it',
    body: 'Your room opens here in AR — look around and step inside before it is built.',
  },
];

export function LandingScreen({ onConnect, notice }: Props) {
  const insets = useSafeAreaInsets();
  const [link, setLink] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleManualConnect = () => {
    const target = parseRoomLink(link.trim());
    if (!target) {
      setError('That link is not a valid Snaproom room link.');
      return;
    }
    setError(null);
    onConnect(target);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand row */}
        <View style={styles.brandRow}>
          <Logo size={40} />
          <View style={styles.brandText}>
            <Text style={styles.wordmark}>Snaproom</Text>
            <Text style={styles.brandTag}>AR VIEWER</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Step inside your space.</Text>
          <Text style={styles.heroBody}>
            Snaproom turns a photo or floor plan into a walkable 3D world. Scan a
            room's QR code to explore it in augmented reality — no account, no
            setup.
          </Text>
        </View>

        {notice ? (
          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>{notice}</Text>
          </View>
        ) : null}

        {/* Steps */}
        <View style={styles.steps}>
          {STEPS.map((step, index) => (
            <View key={step.title} style={styles.step}>
              <LinearGradient
                colors={accentGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.stepBadge}
              >
                <Text style={styles.stepBadgeText}>{index + 1}</Text>
              </LinearGradient>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepBody}>{step.body}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Manual connect — for testing without scanning (e.g. inside Expo Go). */}
        <View style={styles.manualCard}>
          <Text style={styles.manualLabel}>HAVE A ROOM LINK?</Text>
          <Text style={styles.manualHint}>
            Paste a snaproom:// link to open it without scanning.
          </Text>
          <TextInput
            value={link}
            onChangeText={(text) => {
              setLink(text);
              if (error) setError(null);
            }}
            placeholder="snaproom://room?slug=…&host=…"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            onSubmitEditing={handleManualConnect}
            returnKeyType="go"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Pressable
            onPress={handleManualConnect}
            disabled={link.trim().length === 0}
            style={({ pressed }) => [
              styles.connectButton,
              link.trim().length === 0 && styles.connectButtonDisabled,
              pressed && styles.connectButtonPressed,
            ]}
          >
            <Text style={styles.connectButtonText}>Open room</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xl,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  brandText: { gap: 2 },
  wordmark: { ...typography.title, color: colors.textPrimary },
  brandTag: {
    ...typography.label,
    fontSize: 10,
    color: colors.accentBright,
    letterSpacing: 1.5,
  },

  hero: { gap: spacing.md },
  heroTitle: { ...typography.display, color: colors.textPrimary },
  heroBody: { ...typography.body, color: colors.textSecondary },

  noticeBox: {
    backgroundColor: 'rgba(248,113,113,0.10)',
    borderColor: 'rgba(248,113,113,0.35)',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  noticeText: { ...typography.body, color: colors.danger },

  steps: { gap: spacing.lg },
  step: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  stepBadge: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: { color: colors.textPrimary, fontWeight: '700', fontSize: 14 },
  stepText: { flex: 1, gap: 3 },
  stepTitle: { ...typography.title, fontSize: 16, color: colors.textPrimary },
  stepBody: { ...typography.body, fontSize: 14, color: colors.textSecondary },

  manualCard: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  manualLabel: { ...typography.label, color: colors.textSecondary },
  manualHint: { ...typography.body, fontSize: 13, color: colors.textMuted },
  input: {
    marginTop: spacing.xs,
    backgroundColor: colors.background,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    ...typography.mono,
  },
  errorText: { ...typography.body, fontSize: 13, color: colors.danger },
  connectButton: {
    marginTop: spacing.xs,
    backgroundColor: colors.accent,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  connectButtonDisabled: { opacity: 0.35 },
  connectButtonPressed: { opacity: 0.8 },
  connectButtonText: { color: colors.textPrimary, fontWeight: '700', fontSize: 15 },
});
