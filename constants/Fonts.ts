const Fonts = {
    SFLight: require('@/assets/fonts/sf-pro-text-light.ttf'),
    SFRegular: require('@/assets/fonts/sf-pro-text-regular.ttf'),
    SFMedium: require('@/assets/fonts/sf-pro-text-medium.ttf'),
    SFBold: require('@/assets/fonts/sf-pro-text-semibold.ttf'),
    SFHeavy: require('@/assets/fonts/sf-pro-text-heavy.ttf'),
    QSLight: require('@/assets/fonts/Quicksand-Light.ttf'),
    QSRegular: require('@/assets/fonts/Quicksand-Regular.ttf'),
    QSBold: require('@/assets/fonts/Quicksand-SemiBold.ttf'),
    OWRegelar: require('@/assets/fonts/Oswald-Regular.ttf'),
    OWElight: require('@/assets/fonts/Oswald-Light.ttf'),
    Lora: require('@/assets/fonts/Lora.ttf')
}

export type FontFamily = keyof typeof Fonts

export default Fonts
