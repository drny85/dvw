import { useEffect } from 'react'
import useAppSelector from './useAppSelector'
import { Accelerometer } from 'expo-sensors'
import { router } from 'expo-router'

export const useShake = () => {
    const user = useAppSelector((s) => s.auth.user)
    useEffect(() => {
        if (!user) return

        let previousAcceleration = { x: 0, y: 0, z: 0 }
        let shakeDetected = false

        Accelerometer.setUpdateInterval(100)

        const subscription = Accelerometer.addListener((accelerometerData) => {
            const { x, y, z } = accelerometerData
            const acceleration = Math.sqrt(x * x + y * y + z * z)

            if (
                acceleration -
                    Math.sqrt(
                        previousAcceleration.x * previousAcceleration.x +
                            previousAcceleration.y * previousAcceleration.y +
                            previousAcceleration.z * previousAcceleration.z
                    ) >
                1.5
            ) {
                if (!shakeDetected) {
                    shakeDetected = true
                    router.push('/(app)/(nova)/myinfo')
                }
            } else {
                shakeDetected = false
            }

            previousAcceleration = { x, y, z }
        })

        return () => {
            subscription.remove()
        }
    }, [user])
}
