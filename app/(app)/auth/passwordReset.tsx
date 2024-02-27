import Screen from '@/common/components/Screen'
import React, { useState } from 'react'
import { Alert, Button, KeyboardAvoidingView } from 'react-native'
import Header from '@/common/components/Header'
import TextInput from '@/common/components/TextInput'
import { SIZES } from '@/constants/Sizes'
import { auth } from '@/firebase'
import { isEmailValid } from '@/utils/isEmailValid'
import { router } from 'expo-router'
import { sendPasswordResetEmail } from 'firebase/auth'

const passwordReset = () => {
    const [email, setEmail] = useState('')

    const handleSubmit = async () => {
        if (!email || !isEmailValid(email)) {
            Alert.alert('Please enter an email address')
            return
        }
        try {
            await sendPasswordResetEmail(auth, email)
            Alert.alert('Email Sent')
            router.replace('/(app)/auth/')
        } catch (error) {
            console.log('Error =>', error)
        }
        //router.push('/login')
    }
    return (
        <Screen>
            <Header title="Reset Password" onPressBack={router.back} />
            <KeyboardAvoidingView
                behavior="padding"
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                    gap: SIZES.padding * 2
                }}
            >
                <TextInput
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    capitalize={false}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <Button title="Submit" onPress={handleSubmit} />
            </KeyboardAvoidingView>
        </Screen>
    )
}

export default passwordReset
