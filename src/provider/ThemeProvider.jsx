"use client";

import { createTheme, ThemeProvider } from "@mui/material";
import { responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      background: 1850,
      content: 950,
    },
  },
  typography: {
    h6: {
      fontWeight: "bold",
      "@media (min-width:0)": {
        fontSize: "16px",
      },
      "@media (min-width:900px)": {
        fontSize: "20px",
      }
    },
    subtitle1: {
      "@media (min-width:0)": {
        fontSize: "14px",
      },
      "@media (min-width:900px)": {
        fontSize: "16px",
      },
    },
    allVariants: {
      fontFamily: '"Poppins", "Sankofa Display", sans-serif',
      textTransform: "none",
    }
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: false,
      },
    },
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          fontWeight: "bold",
          "@media (min-width:0)": {
            fontSize: "14px",
          },
          "@media (min-width:900px)": {
            fontSize: "16px",
          },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

const ThemeProviderWrapper = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemeProviderWrapper;
