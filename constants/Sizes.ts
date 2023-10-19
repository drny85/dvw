import Constants from 'expo-constants'
import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')

export const SIZES = {
    radius: 12,
    padding: 16,
    font: 16,
    base: 8,
    width,
    height,
    isSmallDevice: width < 374,
    statusBarHeight: Constants.statusBarHeight
}
