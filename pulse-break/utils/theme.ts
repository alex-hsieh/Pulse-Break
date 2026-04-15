export const COLORS = {
  sage: '#9FBFA8',
  sageDeep: '#6F9180',
  sagePale: '#EDF6EF',
  teal: '#A9D9EA',
  tealDeep: '#4F8FA5',
  tealPale: '#EAF7FC',
  coral: '#6AA9C2',
  coralSoft: '#E7F4FA',
  coralPale: '#E7F4FA',
  amber: '#88B39A',
  amberPale: '#EEF7F1',
  cream: '#F6FBFC',
  sand: '#E8F2F5',
  paper: '#FFFFFF',
  ink: '#28414F',
  inkMid: '#496472',
  inkSoft: '#7B96A3',
  mist: '#A9C0CA',
  line: '#D8E8EE',
  purple: '#6AA9C2',
  white: '#FFFFFF',
  shadow: 'rgba(79, 143, 165, 0.10)',
} as const;

export const FONTS = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
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
