import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import {
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions,
    createMaterialTopTabNavigator
} from '@react-navigation/material-top-tabs'
import { ParamListBase, TabNavigationState } from '@react-navigation/native'
import { withLayoutContext } from 'expo-router'

const { Navigator } = createMaterialTopTabNavigator()
export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator)

export const unstable_settings = {
    initialRouteName: '(feeds)'
}

const HomeLayout = () => {
    const bgColor = useThemeColor('background')
    const acent = useThemeColor('accent')
    const text = useThemeColor('text')

    return (
        <MaterialTopTabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: bgColor,
                    paddingTop: SIZES.statusBarHeight
                },

                tabBarActiveTintColor: text,
                tabBarIndicatorStyle: { backgroundColor: acent, height: 4 },
                tabBarLabelStyle: {
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                    fontSize: 18
                }
            }}
        >
            <MaterialTopTabs.Screen
                name="index"
                options={{
                    title: 'Referrals'
                }}
            />
            <MaterialTopTabs.Screen
                name="wireless"
                options={{ title: 'Wireless' }}
            />
            <MaterialTopTabs.Screen name="teams" options={{ title: 'Teams' }} />
        </MaterialTopTabs>
    )
}

export default HomeLayout
