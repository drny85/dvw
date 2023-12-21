import { Alert, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import Header from '@/common/components/Header'
import { router } from 'expo-router'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TextInput from '@/common/components/TextInput'
import View from '@/common/components/View'
import { SIZES } from '@/constants/Sizes'
import useThemeColor from '@/common/hooks/useThemeColor'
import {
    createUserWithEmailAndPassword,
    sendEmailVerification
} from 'firebase/auth'
import { auth } from '@/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { usersCollection } from '@/lib/collections'
import KeyboardScreen from '@/common/components/KeyboardScreen'
import { FIREBASE_ERRORS } from '@/utils/firebaseErrorMessages'
import { UserRole } from '@/features/auth/authSlice'
import { isValidDrascoEmail } from '@/utils/isEmailValid'
import { isFullName } from '@/utils/isFullName'
import { FontAwesome } from '@expo/vector-icons'
import Loading from '@/common/components/Loading'

const scheme = z
    .object({
        name: z.string().min(6, 'Please enter a first and last name'),
        email: z.string().email(),
        password: z
            .string()
            .min(6, 'Password must contain at least 6 characters'),
        confirmPassword: z
            .string()
            .min(6, 'Password must contain at least 6 characters')
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    })

type FormValues = z.infer<typeof scheme>

const Signup = () => {
    const btnColor = useThemeColor('accent')
    const textColor = useThemeColor('text')
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState<UserRole>()
    const [loading, setLoading] = useState(false)
    const onSubmit = async (data: FormValues) => {
        try {
            const { email, password, name } = data
            if (!isValidDrascoEmail(email)) {
                Alert.alert(
                    'Invaid Email',
                    'Your email must be a drascosales.com domain'
                )

                return
            }
            if (!isFullName(name)) {
                Alert.alert(
                    'Invalid Name',
                    'Your name and last name combination must be at least 6 characters'
                )

                return
            }
            setLoading(true)
            const { user } = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )
            if (!user) {
                setLoading(false)
                return
            }
            await sendEmailVerification(user)
            const docRef = doc(usersCollection, user.uid)
            await setDoc(docRef, {
                id: user.uid,
                email: user.email!,
                name: name,
                role: role,
                emailVerified: user.emailVerified,
                createdAt: new Date().toISOString(),
                acceptedEULA: false,
                blockedUsers: []
            })

            reset()
            setLoading(false)
            router.replace('/auth/verify')
        } catch (error) {
            console.log('Error =>', error)
            const err = error as Error
            setLoading(false)
            Alert.alert('Error', FIREBASE_ERRORS[err.message] || err.message)
        }
    }
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isLoading, isSubmitting }
    } = useForm<FormValues>({
        resolver: zodResolver(scheme),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: ''
        }
    })

    if (loading) return <Loading />

    return (
        <Screen>
            {role === undefined && (
                <View style={{ flex: 1 }}>
                    <Header title="Select A Role" onPressBack={router.back} />
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: SIZES.padding * 3
                        }}
                    >
                        <TouchableOpacity
                            style={[
                                styles.btn,
                                {
                                    backgroundColor: btnColor,
                                    minWidth: '80%',
                                    maxWidth: 400
                                }
                            ]}
                            onPress={() => setRole('em')}
                        >
                            <Text
                                center
                                color="white"
                                fontSize={20}
                                fontFamily="SFBold"
                            >
                                Engagement Manager
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.btn,
                                {
                                    backgroundColor: btnColor,
                                    minWidth: '80%',
                                    maxWidth: 400
                                }
                            ]}
                            onPress={() => setRole('coach')}
                        >
                            <Text
                                center
                                color="white"
                                fontSize={20}
                                fontFamily="SFBold"
                            >
                                Coach / Manager
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            {role && (
                <View style={{ flex: 1 }}>
                    <Header
                        title="Create Account"
                        onPressBack={() => {
                            setRole(undefined)
                        }}
                    />
                    <KeyboardScreen containerStyle={{ flex: 1 }}>
                        <View style={styles.container}>
                            <Text center fontSize={20} fontFamily="SFBold">
                                {role === 'em'
                                    ? 'Engagement Manager'
                                    : 'Coach / Manager'}
                            </Text>
                            <View style={{ width: '100%' }}>
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({
                                        field: { onChange, value, onBlur }
                                    }) => (
                                        <TextInput
                                            placeholder="Full Name"
                                            value={value}
                                            autoCapitalize="words"
                                            onBlur={() => {
                                                onBlur()
                                            }}
                                            onChangeText={onChange}
                                            error={
                                                errors.name &&
                                                errors.name.message
                                            }
                                        />
                                    )}
                                />
                            </View>
                            <View style={{ width: '100%' }}>
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({
                                        field: { onChange, value, onBlur }
                                    }) => (
                                        <TextInput
                                            placeholder="Email Address"
                                            value={value}
                                            autoComplete="email"
                                            autoCapitalize="none"
                                            capitalize={false}
                                            autoCorrect={false}
                                            keyboardType="email-address"
                                            onBlur={() => {
                                                onBlur()
                                            }}
                                            onChangeText={onChange}
                                            error={
                                                errors.email &&
                                                errors.email.message
                                            }
                                        />
                                    )}
                                />
                            </View>
                            <View
                                style={{
                                    width: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Controller
                                    control={control}
                                    name="password"
                                    render={({
                                        field: { onChange, value, onBlur }
                                    }) => (
                                        <TextInput
                                            placeholder="Password"
                                            value={value}
                                            onBlur={() => {
                                                onBlur()
                                            }}
                                            onChangeText={onChange}
                                            secureTextEntry={!showPassword}
                                            error={
                                                errors.password &&
                                                errors.password.message
                                            }
                                        />
                                    )}
                                />
                                <FontAwesome
                                    style={{
                                        position: 'absolute',
                                        right: SIZES.padding
                                    }}
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    color={textColor}
                                    name={showPassword ? 'eye' : 'eye-slash'}
                                    size={20}
                                />
                            </View>
                            <View
                                style={{
                                    width: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Controller
                                    control={control}
                                    name="confirmPassword"
                                    render={({
                                        field: { onChange, value, onBlur }
                                    }) => (
                                        <TextInput
                                            placeholder="Confirm Password"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={() => {
                                                onBlur()
                                            }}
                                            secureTextEntry={!showPassword}
                                            error={
                                                errors.confirmPassword &&
                                                errors.confirmPassword.message
                                            }
                                        />
                                    )}
                                />
                                <FontAwesome
                                    style={{
                                        position: 'absolute',
                                        right: SIZES.padding
                                    }}
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    color={textColor}
                                    name={showPassword ? 'eye' : 'eye-slash'}
                                    size={20}
                                />
                            </View>
                            <TouchableOpacity
                                disabled={isLoading || isSubmitting}
                                style={[
                                    styles.btn,
                                    { backgroundColor: btnColor }
                                ]}
                                onPress={handleSubmit(onSubmit)}
                            >
                                <Text
                                    center
                                    color="white"
                                    fontSize={20}
                                    fontFamily="SFBold"
                                >
                                    Signup
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardScreen>
                </View>
            )}
        </Screen>
    )
}

export default Signup

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SIZES.padding,
        gap: SIZES.padding * 1.5,
        width: '100%'
    },
    btn: {
        paddingHorizontal: SIZES.padding * 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: SIZES.radius * 3,
        paddingVertical: SIZES.padding
    }
})
