import { NotificationData } from '@/types'
import * as Notifications from 'expo-notifications'
import { router } from 'expo-router'
import React from 'react'

export function useNotificationObserver() {
    React.useEffect(() => {
        let isMounted = true

        function redirect(notification: Notifications.Notification) {
            const data = notification.request.content.data as NotificationData
            if (data.type === 'new-message') {
                router.push(`/(app)/(root)/(chats)/${data.id}`)
            }
            if (data.type === 'reminder') {
                router.push('/(app)/(modals)/quotes')
            }
            if (data.type === 'feed') {
                router.push('/(app)/(root)/(feeds)/(home)')
            }
        }

        Notifications.getLastNotificationResponseAsync().then((response) => {
            if (!isMounted || !response?.notification) {
                return
            }
            redirect(response?.notification)
        })

        const subscription =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    redirect(response.notification)
                }
            )

        return () => {
            isMounted = false
            subscription.remove()
        }
    }, [])
}
