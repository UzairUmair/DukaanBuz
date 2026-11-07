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
  shape: { borderRadius: 8 },
  components: {
    MuiButton: { styleOverrides: { root: { minHeight: 44, boxShadow: 'none', borderRadius: 'var(--radius-control)', color: 'var(--color-accent)', '&:focus-visible': { outline: '3px solid var(--color-focus)', outlineOffset: 3 }, '&.MuiButton-colorError': { color: 'var(--color-error)' } } } },
    MuiTextField: { defaultProps: { fullWidth: true } },
    MuiDialog: { defaultProps: { fullWidth: true, maxWidth: 'sm' }, styleOverrides: { paper: { backgroundColor: 'var(--color-surface)', color: 'var(--color-ink)', border: '1px solid var(--color-rule)', borderRadius: 'var(--radius-card)' } } },
    MuiDialogTitle: { styleOverrides: { root: { padding: '24px 24px 12px', fontWeight: 700 } } },
    MuiDialogContent: { styleOverrides: { root: { color: 'var(--color-ink-2)' } } },
    MuiDialogActions: { styleOverrides: { root: { padding: '16px 24px 24px', gap: 8 } } },
  },
});
