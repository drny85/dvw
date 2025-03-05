/**
 * The primary brand color used throughout the application.
 */
export const brandColor = '#023047'

/**
 * Colors object that defines the color palette for both light and dark themes.
 *
 * You can add more color tokens to suit your specific use cases like ChatBubbles, Cards etc.
 */
const Colors = {
    light: {
        background: '#F5F5F5',
        primary: '#FFFFFF',
        secondary: '#9a8c98',
        tertiary: '#D3D3D3',
        border: '#1D1E22',
        white: '#ffffff',
        text: '#000000',
        button: '#669bbc',
        accent: '#31572c',
        error: '#FF0000',
        success: '#008000',
        warning: '#bb3e03',
        disabled: '#D3D3D3',
        tabIconDefault: '#808080',
        tabIconSelected: brandColor,
        grey: '#808080',
        placeholder: '#748cab',
        black: '#212121',
        red: '#9e2a2b'
    },
    dark: {
        background: '#14213d',
        white: '#ffffff',
        primary: '#111111',
        secondary: '#3a5a40',
        tertiary: '#A9A9A9',
        text: '#F5F5F5',
        button: brandColor,
        border: '#F5F5F5',
        accent: '#31572c',
        error: '#FF0011',
        success: '#008000',
        warning: '#bb3e03',
        disabled: '#A9A9A9',
        tabIconDefault: '#808080',
        tabIconSelected: brandColor,
        grey: '#808080',
        placeholder: '#748cab',
        black: '#212121',
        red: '#e5383b'
    },
    pink: {
        background: '#14213d',
        white: '#ffffff',
        primary: '#111111',
        secondary: '#3a5a40',
        tertiary: '#A9A9A9',
        text: '#F5F5F5',
        button: brandColor,
        border: '#F5F5F5',
        accent: '#fb6107',
        error: '#FF0011',
        success: '#008000',
        warning: '#FFA500',
        disabled: '#A9A9A9',
        tabIconDefault: '#808080',
        tabIconSelected: brandColor,
        grey: '#808080',
        placeholder: '#748cab',
        black: '#212121',
        red: '#e5383b'
    }
}

/**
 * Type alias for color names, allowing easy access to color keys.
 */
export type ColorName = keyof typeof Colors.light &
    keyof typeof Colors.dark &
    keyof typeof Colors.pink

/**
 * Export the customizable color palette for use throughout your application.
 */
export default Colors
