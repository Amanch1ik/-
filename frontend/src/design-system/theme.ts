export const theme = {
  colors: {
    primary: {
      light: '#4ecdc4',
      main: '#45b7d1',
      dark: '#2c3e50',
    },
    secondary: {
      light: '#ff6b6b',
      main: '#ff4757',
      dark: '#e74c3c',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
      disabled: '#bdc3c7',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    fontSize: {
      small: '0.75rem',
      normal: '1rem',
      medium: '1.25rem',
      large: '1.5rem',
      xlarge: '2rem',
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    round: '50%',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 20px rgba(0,0,0,0.15)',
  },
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    },
    duration: {
      shortest: '150ms',
      shorter: '200ms',
      short: '250ms',
      standard: '300ms',
      complex: '375ms',
      enteringScreen: '225ms',
      leavingScreen: '195ms',
    },
  },
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px',
  },
};
