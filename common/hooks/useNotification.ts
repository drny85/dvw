import * as Notifications from 'expo-notifications'
import { useEffect, useRef } from 'react'
import { Platform } from 'react-native'
import * as Device from 'expo-device'
import { useNavigation } from '@react-navigation/native'

import { doc, setDoc } from '@firebase/firestore'
import useAppSelector from './useAppSelector'
import useThemeColor from './useThemeColor'
import { usersCollection } from '@/lib/collactions'

Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
        return {
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false
        }
    }
})

const useNotifications = () => {
    const nColor = useThemeColor('accent')
    const notificationListener = useRef<any>()
    const responseListener = useRef<any>()
    const user = useAppSelector((state) => state.auth.user)

    useEffect(() => {
        if (!user) return

        registerForPushNotificationsAsync()

        notificationListener.current =
            Notifications.addNotificationReceivedListener(
                (notification: Notifications.Notification) => {
                    const { data } = notification.request.content

                    const result = data as any
                    const { id, notificationType } = result
                    console.log(
                        'notification received',
                        notification,
                        id,
                        notificationType
                    )
                    //ACTIONS WHEN USER RECEIVES NOTIFICATION
                }
            )

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response: Notifications.NotificationResponse) => {
                    const { content } = response.notification.request
                    const data = content.data as any
                    const { id, notificationType } = data

                    // navigation.navigate('DeliveryView', {
                    //     orderId: order.id!
                    // });

                    //ACTIONS WHEN USER CLICK ON NOTIFICATION
                }
            )

        return () => {
            Notifications.removeNotificationSubscription(
                notificationListener.current
            )
            Notifications.removeNotificationSubscription(
                responseListener.current
            )
        }
    }, [user])

    const registerForPushNotificationsAsync = async () => {
        try {
            if (Device.isDevice) {
                const { status: existingStatus } =
                    await Notifications.requestPermissionsAsync()
                let finalStatus = existingStatus
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.getPermissionsAsync()
                    finalStatus = status
                }

                if (finalStatus !== 'granted') {
                    const { canAskAgain } =
                        await Notifications.getPermissionsAsync()
                    if (canAskAgain) {
                        const { status } =
                            await Notifications.requestPermissionsAsync()
                        finalStatus = status
                    }

                    return
                }

                if (user?.pushToken) return
                const token = (await Notifications.getExpoPushTokenAsync()).data

                const userRef = doc(usersCollection, user?.id)
                await setDoc(userRef, { pushToken: token }, { merge: true })

                if (Platform.OS === 'android') {
                    Notifications.setNotificationChannelAsync('default', {
                        name: 'default',
                        importance: Notifications.AndroidImportance.MAX,
                        vibrationPattern: [0, 250, 250, 250],
                        lightColor: nColor
                    })
                }
            }
        } catch (error) {
            const err = error as any
            console.log('Error from useNotifications hooks', err.message)
        }
    }
}

export default useNotifications

export async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here' }
        },
        trigger: { seconds: 2 }
    })
}
