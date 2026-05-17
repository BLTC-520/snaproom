import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { accentGradient, radius } from '../theme';

/**
 * Snaproom mark — a gradient tile with a cut-out square, echoing the web app
 * logo. Sized via the `size` prop; everything inside scales from it.
 */
export function Logo({ size = 48 }: { size?: number }) {
  return (
    <LinearGradient
      colors={accentGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: size * 0.28 },
      ]}
    >
      <View
        style={{
          width: size * 0.36,
          height: size * 0.36,
          borderRadius: size * 0.1,
          backgroundColor: 'rgba(255,255,255,0.95)',
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
});
