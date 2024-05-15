import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import TextInput from '@/common/components/TextInput'
import ThemeSwitcher from '@/common/components/ThemeSwitcher'
import View from '@/common/components/View'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import { getUser } from '@/features/auth/authActions'
import { auth, sendMeATotificationWhenSomeoneLogin } from '@/firebase'

import { FIREBASE_ERRORS } from '@/utils/firebaseErrorMessages'
import { isEmailValid } from '@/utils/isEmailValid'
import { sendMe } from '@/utils/sendMeANotification'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import {
    sendEmailVerification,
    signInWithEmailAndPassword
} from 'firebase/auth'

import { useState } from 'react'
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native'

// Define the AuthScreen component, intended as a starting point for authentication
const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useAppDispatch()
    const btnColor = useThemeColor('accent')
    const textColor = useThemeColor('text')

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                Alert.alert('Please enter all fields')

                return
            }
            if (!isEmailValid(email)) {
                Alert.alert('Email is not valid')

                return
            }
            setLoading(true)
            const { user } = await signInWithEmailAndPassword(
                auth,
                email,
                password
            )

            if (!user) return
            if (user && !user.emailVerified) {
                Alert.alert(
                    'Please verify your email',
                    'There is an account with this email but it has not been verified. \n Please check your inbox and spam folder',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Re-send Email',
                            onPress: async () => {
                                await sendEmailVerification(user)
                                router.replace(`/(app)/auth/${user.email}`)
                            }
                        }
                    ]
                )
                return
            }
            await sendMe(user.email!)
            const noti = sendMeATotificationWhenSomeoneLogin()
            await noti()
            dispatch(
                getUser({ userId: user.uid, isVerified: user.emailVerified })
            )
        } catch (error) {
            const err = error as Error

            console.log('Error =>', err.message)
            Alert.alert('Error', FIREBASE_ERRORS[err.message] || err.message)
        } finally {
            setLoading(false)
        }
    }

    //if (loading) return <Loading />
    return (
        <Screen style={Styles.flex}>
            <ThemeSwitcher small />
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={styles.container}
                    //contentContainerStyle={styles.container}
                >
                    <Text fontSize={26} fontFamily="Lora">
                        Welcome
                    </Text>
                    <View style={{ width: '100%', maxWidth: 600 }}>
                        <TextInput
                            placeholder="Email"
                            autoCapitalize="none"
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            value={email}
                        />
                    </View>
                    <View
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            maxWidth: 600
                        }}
                    >
                        <TextInput
                            placeholder="Password"
                            autoCapitalize="none"
                            secureTextEntry={!showPassword}
                            onChangeText={setPassword}
                            value={password}
                        />
                        <FontAwesome
                            style={{
                                position: 'absolute',
                                right: SIZES.padding
                            }}
                            onPress={() => setShowPassword(!showPassword)}
                            color={textColor}
                            name={showPassword ? 'eye' : 'eye-slash'}
                            size={20}
                        />
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.btn,
                            {
                                backgroundColor: btnColor
                                //opacity: disabled ? 0.5 : 1
                            }
                        ]}
                        onPress={handleLogin}
                        // disabled={disabled}
                    >
                        <Text
                            center
                            color="white"
                            fontSize={22}
                            fontFamily="SFBold"
                        >
                            Login
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.reset}>
                        <TouchableOpacity
                            onPress={() => router.push('/auth/signup')}
                        >
                            <Text center fontSize={16} fontFamily="SFMedium">
                                Create Account?
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push('/auth/passwordReset')}
                        >
                            <Text
                                color="warning"
                                center
                                fontSize={16}
                                fontFamily="SFMedium"
                            >
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Screen>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: SIZES.padding * 2,
        gap: SIZES.padding * 1.5,
        // maxWidth: 600,
        width: '100%',
        marginHorizontal: 'auto',
        flex: 1
    },
    btn: {
        borderRadius: SIZES.radius * 3,
        paddingHorizontal: SIZES.padding * 4,
        paddingVertical: SIZES.padding * 0.8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    reset: {
        position: 'absolute',
        bottom: 30,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%'
    }
})
