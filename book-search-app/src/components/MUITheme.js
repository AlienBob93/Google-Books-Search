import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';

// Responsive Font sizes
/* 
    Wrap any text (Typography component) that needs to be responsive 
    in a ThemeProvider component with fontTheme as the theme 
*/
export const fontTheme = responsiveFontSizes(createTheme());

/* Additional Strings and custom themes can be moved here - for future iterations */