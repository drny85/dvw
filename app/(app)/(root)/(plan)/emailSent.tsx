import React from 'react'
import AnimatedLottieView from 'lottie-react-native'
import { router } from 'expo-router'

const emailSent = () => {
    return (
        <AnimatedLottieView
            source={require('@/assets/animations/email-light.json')}
            autoPlay
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            resizeMode="contain"
            onAnimationFinish={router.back}
            loop={false}
        />
    )
}

export default emailSent
