import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: ${theme.typography.fontFamily};
    font-size: 16px;
    line-height: 1.5;
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background.default};
  }

  a {
    text-decoration: none;
    color: ${theme.colors.primary.main};
    transition: color ${theme.transitions.duration.short} ${theme.transitions.easing.easeInOut};

    &:hover {
      color: ${theme.colors.primary.dark};
    }
  }

  button {
    font-family: ${theme.typography.fontFamily};
    border: none;
    background: none;
    cursor: pointer;
    transition: all ${theme.transitions.duration.short} ${theme.transitions.easing.easeInOut};
  }

  input, select, textarea {
    font-family: ${theme.typography.fontFamily};
    border: 1px solid ${theme.colors.text.disabled};
    border-radius: ${theme.borderRadius.sm};
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    transition: all ${theme.transitions.duration.short} ${theme.transitions.easing.easeInOut};

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary.main};
      box-shadow: 0 0 0 2px rgba(69, 183, 209, 0.2);
    }
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.background.default};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary.light};
    border-radius: ${theme.borderRadius.round};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primary.main};
  }

  /* Responsive Typography */
  @media (max-width: ${theme.breakpoints.sm}) {
    html, body {
      font-size: 14px;
    }
  }

  /* Accessibility Improvements */
  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
    }
  }
`;
