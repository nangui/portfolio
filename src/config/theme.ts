export const theme = {
  colors: {
    bg: {
      primary: '#0F1117',
      secondary: '#1A1D24',
      tertiary: '#252932',
    },
    text: {
      primary: '#F5F5F5',
      secondary: '#A1A8B3',
      tertiary: '#6B7280',
    },
    accent: {
      primary: '#3B82F6',
      hover: '#2563EB',
      light: '#60A5FA',
    },
    border: {
      default: '#1F2937',
      light: '#374151',
    },
    threejs: {
      base: '#3B82F6',
      secondary: '#1E293B',
    },
  },
  typography: {
    fontHeading: "'Space Grotesk', system-ui, sans-serif",
    fontBody: "'Inter', system-ui, sans-serif",
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    section: '6rem',
    sectionMobile: '4rem',
  },
} as const;

export type Theme = typeof theme;
