import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: 'var(--font-body)',
    h1: { fontFamily: 'var(--font-display)', fontWeight: 700 },
    h2: { fontFamily: 'var(--font-display)', fontWeight: 700 },
    h3: { fontFamily: 'var(--font-display)', fontWeight: 700 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: { styleOverrides: { root: { minHeight: 44, boxShadow: 'none' } } },
    MuiTextField: { defaultProps: { fullWidth: true } },
    MuiDialog: { defaultProps: { fullWidth: true } },
  },
});
