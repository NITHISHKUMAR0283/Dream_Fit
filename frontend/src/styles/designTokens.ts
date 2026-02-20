// Design Tokens for Premium Women's Fashion Brand

export const designTokens = {
  // Color Palette - Sophisticated & Feminine
  colors: {
    primary: {
      50: '#fdf4f5',
      100: '#fce8ea',
      200: '#f8d1d6',
      300: '#f2a9b3',
      400: '#ea7a8a',
      500: '#de4d62', // Main brand color - sophisticated rose
      600: '#cb3651',
      700: '#ab2943',
      800: '#8f253e',
      900: '#7a233a',
    },
    secondary: {
      50: '#faf9f7',
      100: '#f4f1eb',
      200: '#e8e1d4',
      300: '#d9cbb5',
      400: '#c7b094',
      500: '#b8967a', // Warm nude/beige
      600: '#a8826a',
      700: '#8c6b58',
      800: '#73574b',
      900: '#5e473d',
    },
    accent: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Sophisticated blue
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Typography - Elegant & Readable
  typography: {
    fontFamily: {
      primary: ['Inter', 'system-ui', 'sans-serif'],
      heading: ['Playfair Display', 'Georgia', 'serif'],
      accent: ['Dancing Script', 'cursive'],
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing - Consistent & Harmonious
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
  },

  // Border Radius - Soft & Modern
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  // Shadows - Elegant Depth
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
    elegant: '0 8px 32px rgba(222, 77, 98, 0.12)',
    soft: '0 4px 20px rgba(222, 77, 98, 0.08)',
  },

  // Animations - Smooth & Delightful
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      ease: 'ease',
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // Breakpoints - Responsive Design
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-Index - Layering
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
};

// Component-specific design tokens
export const componentTokens = {
  button: {
    height: {
      sm: '2rem',
      md: '2.75rem',
      lg: '3.5rem',
    },
    padding: {
      sm: '0.5rem 1rem',
      md: '0.75rem 1.5rem',
      lg: '1rem 2rem',
    },
  },
  input: {
    height: {
      sm: '2.25rem',
      md: '2.75rem',
      lg: '3.25rem',
    },
  },
  card: {
    padding: '1.5rem',
    borderRadius: '0.75rem',
    shadow: designTokens.boxShadow.soft,
  },
};

// Fashion-specific tokens
export const fashionTokens = {
  productCard: {
    aspectRatio: '3/4', // Perfect for fashion photography
    hoverScale: '1.02',
    transitionDuration: '300ms',
  },
  categoryCard: {
    aspectRatio: '4/3',
    overlayOpacity: '0.4',
  },
  imageGallery: {
    thumbnailSize: '4rem',
    mainImageAspectRatio: '1/1',
  },
};

export default designTokens;