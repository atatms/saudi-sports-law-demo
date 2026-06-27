/**
 * Design tokens extracted from the product mockups (Arabic, RTL, olive-green brand).
 */
export const colors = {
  bg: '#F1F0EB',
  card: '#FFFFFF',
  cardAlt: '#F7F6F1',

  primary: '#4E6137',
  primaryDark: '#3C4C2A',
  primaryLight: '#E7ECDF',
  primaryMuted: '#DCE3D1',

  accent: '#EAD3CA', // peach used for "skills to improve" / portfolio banner
  accentSoft: '#F4E3DD',
  accentText: '#B26A52',

  text: '#2B2B2B',
  textMuted: '#8C8C84',
  textFaint: '#A9A9A1',

  border: '#E8E7E1',
  divider: '#EFEEE9',

  gold: '#C9A227',
  goldSoft: '#F3E9C9',

  success: '#4E6137',
  successBg: '#E3EAD7',

  info: '#3F6CB0',
  infoBg: '#DDE7F4',

  danger: '#C0564B',
  dangerBg: '#F4DAD5',

  chipBg: '#F4F3EE',
  white: '#FFFFFF',
  shadow: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const font = {
  // System fonts render Arabic correctly on both iOS and Android.
  h1: 26,
  h2: 20,
  h3: 17,
  body: 15,
  small: 13,
  tiny: 11,
};

export const shadow = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  floating: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
};
