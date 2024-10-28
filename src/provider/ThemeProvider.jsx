"use client";

import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: '"Poppins", "Sankofa Display", sans-serif',
      textTransform: "none",
    },
  },
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
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: false,
      },
    },
  },
});

const ThemeProviderWrapper = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemeProviderWrapper;