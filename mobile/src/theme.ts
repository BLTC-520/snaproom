/**
 * Snaproom mobile design tokens.
 *
 * Kept deliberately small and flat — the app is one landing screen and one
 * viewer screen, so a single token file is easier to scan than a system.
 * Palette mirrors the web viewer: near-black canvas, blue → cyan accent.
 */

export const colors = {
  /** App canvas — slightly blue-black so it doesn't read as pure OLED black. */
  background: '#05070D',
  /** Raised surfaces: cards, the viewer header. */
  surface: '#0E121C',
  surfaceBorder: 'rgba(255,255,255,0.10)',

  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.62)',
  textMuted: 'rgba(255,255,255,0.38)',

  /** Accent gradient endpoints (blue → cyan), matching the web app logo. */
  accent: '#3B82F6',
  accentBright: '#22D3EE',

  danger: '#F87171',
} as const;

/** Accent gradient stops, ready to spread into a gradient component. */
export const accentGradient = [colors.accent, colors.accentBright] as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const typography = {
  /** Wordmark / hero. */
  display: { fontSize: 34, fontWeight: '700' as const, letterSpacing: -0.5 },
  title: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  label: { fontSize: 13, fontWeight: '600' as const, letterSpacing: 0.3 },
  mono: { fontSize: 13, fontWeight: '500' as const },
} as const;
