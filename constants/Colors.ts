/**
 * The primary brand color used throughout the application.
 */
export const brandColor = "#023047";

/**
 * Colors object that defines the color palette for both light and dark themes.
 *
 * You can add more color tokens to suit your specific use cases like ChatBubbles, Cards etc.
 */
const Colors = {
  light: {
    background: "#F5F5F5",
    primary: "#FFFFFF",
    secondary: "#9a8c98",
    tertiary: "#D3D3D3",
    border: "#1D1E22",
    white: "#ffffff",
    text: "#000000",
    button: "#669bbc",
    accent: "#c6ac8f",
    error: "#FF0000",
    success: "#008000",
    warning: "#FFA500",
    disabled: "#D3D3D3",
    tabIconDefault: "#808080",
    tabIconSelected: brandColor,
    grey: "#808080",
    placeholder: "#748cab",
  },
  dark: {
    background: "#1D1E22",
    white: "#ffffff",
    primary: "#111111",
    secondary: "#3a5a40",
    tertiary: "#A9A9A9",
    text: "#F5F5F5",
    button: brandColor,
    border: "#F5F5F5",
    accent: brandColor,
    error: "#FF0011",
    success: "#008000",
    warning: "#FFA500",
    disabled: "#A9A9A9",
    tabIconDefault: "#808080",
    tabIconSelected: brandColor,
    grey: "#808080",
    placeholder: "#748cab",
  },
};

/**
 * Type alias for color names, allowing easy access to color keys.
 */
export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Export the customizable color palette for use throughout your application.
 */
export default Colors;
