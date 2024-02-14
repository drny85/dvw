import useThemeColor from '@/common/hooks/useThemeColor'
import {
    isFirstTime,
    resetFirstTime,
    setNotFirstTime
} from '@/utils/checkFirstTimeUser'
import {
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions,
    createMaterialTopTabNavigator
} from '@react-navigation/material-top-tabs'
import { ParamListBase, TabNavigationState } from '@react-navigation/native'
import { router, withLayoutContext } from 'expo-router'
import { useEffect } from 'react'
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

    useEffect(() => {
        async function checkFirstTime() {
            const isFirst = await isFirstTime()
            if (isFirst) {
                console.log(
                    'Welcome! This is the first time the user opens the app.'
                )
                // Perform any first-time setup or welcome actions here
                // For example, navigate to a welcome screen or show a tutorial
                // Once the first-time actions are completed, set the user as not first time
                // await setNotFirstTime()
                router.replace('/(app)/(modals)/welcome')
            } else {
                console.log('Welcome back! The user has opened the app before.')
                // Perform actions for returning users
            }
        }
        checkFirstTime()
    }, [])
    return (
        <MaterialTopTabs
            screenOptions={{
                tabBarStyle: { backgroundColor: bgColor },
                tabBarActiveTintColor: text,
                tabBarIndicatorStyle: { backgroundColor: acent, height: 3 },
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
