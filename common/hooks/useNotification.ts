import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { useEffect, useRef } from 'react'
import { Alert, Platform } from 'react-native'

import { usersCollection } from '@/lib/collections'
import { doc, setDoc } from '@firebase/firestore'
import useAppSelector from './useAppSelector'
import useThemeColor from './useThemeColor'
import moment from 'moment'
import { NotificationData } from '@/types'

Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
        console.log('NOTIFICATION', notification)
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
                    console.log('NOTI =>', data)

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
export type NotificationBody = {
    date: string
    title: string
    body: string
    data: NotificationData
}
export async function schedulePushNotification(values: NotificationBody) {
    if (moment(values.date).diff(new Date(), 'seconds') < 1) {
        Alert.alert('select a time in the future')
        return
    }
    try {
        const noti = await Notifications.scheduleNotificationAsync({
            content: {
                title: values.title,
                body: values.body,
                data: values.data,
                sound: true,
                vibrate: [0, 250, 250, 250],
                autoDismiss: true
            },
            trigger: { date: new Date(values.date) },
            identifier: 'reminder'
        })
    } catch (error) {
        console.log('@Error at scheduleNotification', error)
    }
}
