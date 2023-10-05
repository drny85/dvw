import React, { useCallback } from 'react'
import ThemeSwitcher from '@/common/components/ThemeSwitcher'
import Screen from '@/common/components/Screen'
import View from '@/common/components/View'
import Header from '@/common/components/Header'
import Styles from '@/constants/Styles'
import { SIZES } from '@/constants/Sizes'
import { FontAwesome } from '@expo/vector-icons'

import useThemeColor from '@/common/hooks/useThemeColor'
import { Alert, Button, Image, TouchableOpacity } from 'react-native'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import { logoutUser, updateUser } from '@/features/auth/authActions'
import useAppSelector from '@/common/hooks/useAppSelector'
import { StyleSheet } from 'react-native'
import Text from '@/common/components/Text'
import Row from '@/common/components/Row'
import { AnimatePresence, MotiView } from 'moti'
import TextInput from '@/common/components/TextInput'
import { isFullName } from '@/utils/isFullName'
import { useAuth } from '@/common/hooks/auth/useAuth'
import { AppUser } from '@/features/auth/authSlice'
import * as Clipboard from 'expo-clipboard'
import { router } from 'expo-router'
import { deleteUserAccount } from '@/firebase'

const Settings = () => {
    useAuth()
    const iconColor = useThemeColor('text')
    const deleteColor = useThemeColor('warning')
    const user = useAppSelector((state) => state.auth.user)
    const [updateName, setUpdateName] = React.useState(false)
    const dispatch = useAppDispatch()
    const copyToClipboard = async () => {
        await Clipboard.setStringAsync('robert.melendez@drascosales.com')
        Alert.alert(
            'Copied to clipboard',
            'The text has been copied to the clipboard'
        )
    }

    const handleDeleteAccount = async () => {
        try {
            Alert.alert(
                'Delete Account',
                'Are you sure you want to delete your account?',
                [
                    {
                        text: 'Yes',
                        onPress: deleteAccount
                    },
                    { text: 'Cancel', style: 'cancel' }
                ]
            )
        } catch (error) {
            console.log(error)
        }
    }

    const deleteAccount = async () => {
        try {
            const func = deleteUserAccount('deleleAccount')
            await func({ uid: user?.id! })
            dispatch(logoutUser())
            router.replace('/(app)/auth')
        } catch (error) {
            console.log(error)
        }
    }

    const onUpdateName = useCallback(async (value: string) => {
        try {
            console.log(value)
            const isValid = isFullName(value)
            if (!isValid) {
                Alert.alert('Invalid Name', 'Please enter a valid name')
                return
            }
            const updatedUser: AppUser = {
                ...user!,
                name: value
            }

            dispatch(updateUser(updatedUser))
            setUpdateName(false)
        } catch (error) {
            console.log('Error updating name', error)
        }
    }, [])

    const logoutPress = () => {
        dispatch(logoutUser())
    }
    return (
        <Screen>
            <Row
                style={{
                    justifyContent: 'space-between',
                    paddingHorizontal: SIZES.base
                }}
            >
                <Row style={{ gap: SIZES.padding }}>
                    <ThemeSwitcher small />
                    <Text fontFamily="SFBold" fontSize={20}>
                        Profile
                    </Text>
                </Row>

                <TouchableOpacity
                    onPress={() => {
                        Alert.alert(
                            'Log Out',
                            'Are you sure you want to log out?',
                            [
                                {
                                    text: 'Yes',
                                    onPress: logoutPress,
                                    style: 'destructive'
                                },
                                { text: 'Cancel', style: 'cancel' }
                            ]
                        )
                    }}
                >
                    <FontAwesome
                        style={{ marginRight: SIZES.base }}
                        name="sign-out"
                        size={30}
                        color={iconColor}
                    />
                </TouchableOpacity>
            </Row>
            <View style={{ ...Styles.flex, marginTop: SIZES.base }}>
                <Image
                    source={
                        user?.image
                            ? { uri: user.image }
                            : require('@/assets/images/profile.jpg')
                    }
                    style={styles.image}
                />
                <View style={styles.info}>
                    <Row style={{ gap: SIZES.padding }}>
                        <Text fontFamily="SFBold" capitalize>
                            Full Name
                        </Text>
                        {user?.name && !updateName ? (
                            <Text capitalize>{user?.name}</Text>
                        ) : (
                            <Button
                                title={updateName ? 'Cancel' : 'Add Name'}
                                onPress={() => {
                                    setUpdateName((prev) => !prev)
                                }}
                            />
                        )}
                    </Row>
                    <UpdateForm
                        show={updateName}
                        onPress={onUpdateName}
                        placeholder="Full Name"
                    />

                    <Row style={{ gap: SIZES.padding }}>
                        <Text fontFamily="SFBold" capitalize>
                            Email
                        </Text>
                        <Text>{user?.email}</Text>
                    </Row>
                    <Row style={{ gap: SIZES.padding }}>
                        <Text fontFamily="SFBold" capitalize>
                            Role
                        </Text>

                        <Text>
                            {user?.role === 'em'
                                ? 'Engagement Manager'
                                : user?.role === 'coach'
                                ? 'Coach'
                                : 'EM'}
                        </Text>
                    </Row>
                    <TouchableOpacity
                        onPress={() =>
                            router.push('/(app)/(root)/(settings)/numbers')
                        }
                    >
                        <Row
                            style={{
                                gap: SIZES.padding,
                                justifyContent: 'space-between'
                            }}
                        >
                            <Text fontFamily="SFBold" capitalize>
                                Useful Numbers
                            </Text>

                            <FontAwesome
                                name="chevron-right"
                                size={20}
                                color={iconColor}
                            />
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            {
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 30,
                                ...Styles.boxShadow,
                                backgroundColor: 'grey',
                                borderRadius: SIZES.radius,
                                padding: SIZES.padding,
                                maxWidth: '60%',
                                alignSelf: 'center',
                                paddingHorizontal: SIZES.padding * 3
                            }
                        ]}
                        onPress={() =>
                            router.push('/(app)/(root)/(settings)/donate')
                        }
                    >
                        <Row style={{ gap: SIZES.base }}>
                            <FontAwesome
                                name="dollar"
                                size={20}
                                color={iconColor}
                            />
                            <Text fontFamily="SFBold" capitalize>
                                Donate
                            </Text>
                        </Row>
                    </TouchableOpacity>

                    {!user?.image && (
                        <>
                            <Text
                                fontFamily="SFLight"
                                style={{ lineHeight: 26, marginTop: 20 }}
                            >
                                Please send me a spark email to get your profile
                                picture and update it accordingly
                            </Text>
                            <Row>
                                <Text>robert.melendez@drascosales.com</Text>
                                <TouchableOpacity
                                    onPress={copyToClipboard}
                                    style={{ marginLeft: 10 }}
                                >
                                    <Text color="button" fontFamily="SFLight">
                                        Copy
                                    </Text>
                                </TouchableOpacity>
                            </Row>
                        </>
                    )}
                </View>
                <Row
                    style={{
                        position: 'absolute',
                        bottom: 20,
                        left: 0,
                        right: 0,
                        alignSelf: 'center',
                        gap: SIZES.padding,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Text color="grey">Delete My Account</Text>
                    <TouchableOpacity
                        onPress={handleDeleteAccount}
                        style={{ padding: SIZES.base }}
                    >
                        <FontAwesome
                            name="trash-o"
                            size={20}
                            color={deleteColor}
                        />
                    </TouchableOpacity>
                </Row>
            </View>
        </Screen>
    )
}

export default Settings

const styles = StyleSheet.create({
    image: {
        height: SIZES.width * 0.5,
        width: SIZES.width * 0.5,
        borderRadius: (SIZES.width * 0.5) / 2,
        alignSelf: 'center'
    },
    info: {
        padding: SIZES.padding,
        gap: SIZES.padding
    }
})
type Props = {
    show: boolean
    placeholder: string
    onPress: (value: string) => void
}
const UpdateForm = ({ show, onPress, placeholder }: Props) => {
    const [value, setValue] = React.useState('')
    return (
        <AnimatePresence>
            {show && (
                <MotiView
                    from={{ opacity: 0, translateY: -30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    exit={{ opacity: 0, translateY: -30 }}
                    transition={{ type: 'timing', duration: 400 }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: SIZES.padding,
                            alignItems: 'center',
                            width: '70%'
                        }}
                    >
                        <TextInput
                            placeholder={placeholder}
                            value={value}
                            onChangeText={setValue}
                            autoCapitalize="words"
                        />
                        <Button
                            title="Save"
                            onPress={() => {
                                onPress(value)
                            }}
                        />
                    </View>
                </MotiView>
            )}
        </AnimatePresence>
    )
}
