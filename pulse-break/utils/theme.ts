export const COLORS = {
  sage: '#7A9E7E',
  sageDeep: '#5F7F63',
  teal: '#3D8B8B',
  tealDeep: '#2E6D6D',
  coral: '#D4715A',
  coralSoft: '#F3D9D1',
  cream: '#F8F5EF',
  sand: '#EEE6D8',
  paper: '#FFFDF9',
  ink: '#24303A',
  inkSoft: '#5F6875',
  mist: '#A2A7B1',
  line: '#E6DED1',
  white: '#FFFFFF',
  shadow: 'rgba(36, 48, 58, 0.08)',
} as const;

export const SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const RADIUS = {
  sm: 12,
  md: 18,
  lg: 24,
  pill: 999,
} as const;

export const SHADOW = {
  shadowColor: COLORS.shadow,
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 1,
  shadowRadius: 24,
  elevation: 4,
} as const;
