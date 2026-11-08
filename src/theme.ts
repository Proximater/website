import { createTheme } from "@mui/material/styles";

/** Brand values from css/style.css, so MUI components match the theme stylesheet. */
export const brand = {
  red: "#cc0033",
  text: "#333",
  bodyFont: '"Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif',
  headingFont: '"Montserrat", sans-serif',
};

export const theme = createTheme({
  palette: {
    primary: { main: brand.red },
    text: { primary: brand.text },
  },
  typography: {
    fontFamily: brand.bodyFont,
  },
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: { marginTop: 4, minWidth: 160 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          fontWeight: 400,
          paddingTop: 8,
          paddingBottom: 8,
          "&.Mui-selected": { color: brand.red, fontWeight: 500 },
        },
      },
    },
  },
});
