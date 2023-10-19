import Screen from '@/common/components/Screen'
import ThemeSwitcher from '@/common/components/ThemeSwitcher'
import View from '@/common/components/View'
import { SIZES } from '@/constants/Sizes'
import Styles from '@/constants/Styles'
import { FontAwesome } from '@expo/vector-icons'
import React, { useCallback } from 'react'

import Row from '@/common/components/Row'
import Text from '@/common/components/Text'
import TextInput from '@/common/components/TextInput'
import { useAuth } from '@/common/hooks/auth/useAuth'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { logoutUser, updateUser } from '@/features/auth/authActions'
import { AppUser } from '@/features/auth/authSlice'
import { deleteUserAccount } from '@/firebase'
import { isFullName } from '@/utils/isFullName'
import * as Clipboard from 'expo-clipboard'
import { router } from 'expo-router'
import { AnimatePresence, MotiView } from 'moti'
import {
    Alert,
    Button,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import { formatPhone } from '@/utils/formatPhone'
import Divider from '@/common/components/Divider'

const Settings = () => {
    useAuth()
    const iconColor = useThemeColor('text')
    const donateColor = useThemeColor('secondary')
    const deleteColor = useThemeColor('warning')
    const user = useAppSelector((state) => state.auth.user)
    const [updatePhone, setUpdatePhone] = React.useState('')
    const [showPhone, setShowPhone] = React.useState(false)
    const [updateName, setUpdateName] = React.useState(false)
    const dispatch = useAppDispatch()

    const handleSignOut = () => {
        Alert.alert('Signing Out', 'Are you sure you want to sign out?', [
            { text: 'Yes', onPress: () => dispatch(logoutUser()) }
        ])
    }

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

    const onUpdatePhone = async (value: string) => {
        try {
            if (!value || value.length < 14) {
                Alert.alert('Invalid Phone', 'Please enter a valid phone')
                return
            }

            const updatedUser: AppUser = {
                ...user!,
                phone: value
            }

            dispatch(updateUser(updatedUser))
            setShowPhone(false)
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

    return (
        <Screen>
            <Row style={{ justifyContent: 'space-between' }}>
                <ThemeSwitcher small />
                <Row
                    style={{
                        justifyContent: 'space-between',
                        flex: 1,
                        paddingHorizontal: SIZES.padding
                    }}
                >
                    <Text fontSize={20} fontFamily="SFBold">
                        Profile
                    </Text>
                    <TouchableOpacity onPress={handleSignOut}>
                        <FontAwesome
                            name="sign-out"
                            size={30}
                            color={iconColor}
                        />
                    </TouchableOpacity>
                </Row>
            </Row>

            <ScrollView style={{ ...Styles.flex, marginTop: SIZES.base }}>
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
                    <Row style={{ gap: SIZES.padding }}>
                        <Text fontFamily="SFBold" capitalize>
                            Cell Phone
                        </Text>
                        {user?.phone && !updatePhone ? (
                            <Text capitalize>{user?.phone}</Text>
                        ) : (
                            <Button
                                title={updatePhone ? 'Cancel' : 'Add Phone'}
                                onPress={() => {
                                    setShowPhone((prev) => !prev)
                                }}
                            />
                        )}
                    </Row>
                    <UpdateForm
                        show={updateName}
                        onPress={onUpdateName}
                        placeholder="Full Name"
                    />
                    <UpdateForm
                        show={showPhone}
                        onPress={onUpdatePhone}
                        placeholder="Cell Phone"
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
                <Divider />
                <View style={{ gap: SIZES.padding, marginBottom: 10 }}>
                    <TouchableOpacity
                        onPress={() =>
                            router.push(
                                '/(app)/(root)/(settings)/helpers/referees'
                            )
                        }
                    >
                        <Row
                            style={{
                                justifyContent: 'space-between',
                                paddingHorizontal: SIZES.padding
                            }}
                        >
                            <Text fontFamily="SFBold">My Referees / LA</Text>
                            <FontAwesome
                                name="chevron-right"
                                size={20}
                                color={iconColor}
                            />
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            router.push(
                                '/(app)/(root)/(settings)/helpers/managers'
                            )
                        }
                        style={{
                            marginVertical: SIZES.padding
                        }}
                    >
                        <Row
                            style={{
                                justifyContent: 'space-between',
                                paddingHorizontal: SIZES.padding
                            }}
                        >
                            <Text fontFamily="SFBold">My Managers / CEs</Text>
                            <FontAwesome
                                name="chevron-right"
                                size={20}
                                color={iconColor}
                            />
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            router.push(
                                '/(app)/(root)/(settings)/helpers/coach'
                            )
                        }
                        style={{
                            marginBottom: SIZES.padding
                        }}
                    >
                        <Row
                            style={{
                                justifyContent: 'space-between',
                                paddingHorizontal: SIZES.padding
                            }}
                        >
                            <Text fontFamily="SFBold">My Coach</Text>
                            <FontAwesome
                                name="chevron-right"
                                size={20}
                                color={iconColor}
                            />
                        </Row>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            router.push('/(app)/(root)/(settings)/numbers')
                        }
                    >
                        <Row
                            style={{
                                paddingHorizontal: SIZES.padding,
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
                </View>
                <Row
                    style={{
                        marginVertical: 20,
                        left: 0,
                        right: 0,
                        alignSelf: 'center',
                        gap: SIZES.padding,
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: SIZES.base
                    }}
                >
                    <TouchableOpacity
                        style={[
                            {
                                justifyContent: 'center',
                                alignItems: 'center',
                                ...Styles.boxShadow,
                                backgroundColor: donateColor,
                                borderRadius: SIZES.radius,
                                paddingVertical: SIZES.base,
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
                                color={'white'}
                            />
                            <Text fontFamily="SFBold" capitalize color="white">
                                Donate
                            </Text>
                        </Row>
                    </TouchableOpacity>
                    <Row>
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
                </Row>
            </ScrollView>
        </Screen>
    )
}

export default Settings

const styles = StyleSheet.create({
    image: {
        height: SIZES.width * 0.4,
        width: SIZES.width * 0.4,
        borderRadius: (SIZES.width * 0.4) / 2,
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
                            onChangeText={(text) =>
                                placeholder.includes('Phone')
                                    ? setValue(formatPhone(text))
                                    : setValue(text)
                            }
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
