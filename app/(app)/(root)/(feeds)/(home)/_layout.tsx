import useThemeColor from '@/common/hooks/useThemeColor'
import {
    createMaterialTopTabNavigator,
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions
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
                tabBarStyle: { backgroundColor: bgColor },
                tabBarActiveTintColor: text,
                tabBarIndicatorStyle: { backgroundColor: acent },
                tabBarLabelStyle: {
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                    fontSize: 16
                }
            }}
        >
            <MaterialTopTabs.Screen name="index" options={{ title: 'Posts' }} />
            <MaterialTopTabs.Screen name="feeds" options={{ title: 'Feeds' }} />

            <MaterialTopTabs.Screen
                name="followups"
                options={{ title: 'Follow Ups' }}
            />
        </MaterialTopTabs>
    )
}

export default HomeLayout
