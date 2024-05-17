import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import Colors from './Colors'

export const StackScreenWithSearchBar: NativeStackNavigationOptions = {
    headerLargeTitle: true,
    headerLargeStyle: {
        backgroundColor: Colors.light.accent
    },
    headerLargeTitleStyle: {
        color: Colors.light.white
    },

    headerSearchBarOptions: {
        hintTextColor: Colors.light.secondary,
        tintColor: Colors.light.white,
        barTintColor: Colors.light.white,
        textColor: '#212121'
    },

    headerTintColor: Colors.light.accent,
    headerTransparent: true,
    headerBlurEffect: 'prominent',
    headerShadowVisible: false
}
