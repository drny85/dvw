import { Entypo, Feather, FontAwesome } from '@expo/vector-icons'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
    StyleSheet,
    SafeAreaView,
    View,
    ScrollView,
    TouchableOpacity,
    Switch,
    Image,
    Alert,
    Button
} from 'react-native'
import { useAuth } from '../hooks/auth/useAuth'
import useAppSelector from '../hooks/useAppSelector'
import { router } from 'expo-router'
import ThemeSwitcher from './ThemeSwitcher'
import useAppDispatch from '../hooks/useAppDispatch'
import {
    setPushNotifications,
    setSaveContact,
    setShow5G
} from '@/features/settings/settingsSlice'
import { deleteUserAccount } from '@/firebase'
import { logoutUser, updateUser } from '@/features/auth/authActions'
import { SIZES } from '@/constants/Sizes'
import useThemeColor from '../hooks/useThemeColor'
import { useNotifications } from '../hooks/useNotification'
import Text from './Text'
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetTextInput
} from '@gorhom/bottom-sheet'
import { formatPhone } from '@/utils/formatPhone'
import { isFullName } from '@/utils/isFullName'
import Row from './Row'

type Props = {
    onPress: () => void
}
export default function ModernSettingsPage({ onPress }: Props) {
    useAuth()
    const { registerForPushNotificationsAsync } = useNotifications()
    const dispatch = useAppDispatch()
    const deleteColor = useThemeColor('warning')
    const iconColor = useThemeColor('text')
    const bgColor = useThemeColor('background')
    const secondaryColor = useThemeColor('primary')
    const { show5G, saveContact } = useAppSelector((s) => s.settings)
    const user = useAppSelector((state) => state.auth.user)
    const bottomSheetRef = useRef<BottomSheet>(null)
    const snapoints = useMemo(() => ['50%', '70%'], [])
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    )

    const handleSignOut = () => {
        Alert.alert('Signing Out', 'Are you sure you want to sign out?', [
            {
                text: 'Yes',
                style: 'destructive',
                onPress: () => dispatch(logoutUser())
            },
            { text: 'Cancel', style: 'cancel' }
        ])
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

    const resetForm = () => {
        setName('')
        setPhone('')
        bottomSheetRef.current?.close()
    }

    const handlePushNotificationChange = (value: boolean) => {
        if (!user) return
        if (value) {
            Alert.alert(
                'Enable Push Notifications',
                'Are you sure you want to enable push notifications?',
                [
                    {
                        text: 'Yes',
                        onPress: () => {
                            dispatch(setPushNotifications(value))
                            registerForPushNotificationsAsync()
                        }
                    },
                    { text: 'Cancel', style: 'cancel' }
                ]
            )
        } else {
            Alert.alert(
                'Disable Push Notifications',
                'Are you sure you want to disable push notifications?',
                [
                    {
                        text: 'Yes',
                        onPress: () => {
                            dispatch(setPushNotifications(value))
                            // unregisterForPushNotificationsAsync()
                            dispatch(updateUser({ ...user, pushToken: null }))
                        }
                    },
                    { text: 'Cancel', style: 'cancel' }
                ]
            )
        }
    }

    useEffect(() => {
        if (user) {
            setName(user.name)
            setPhone(formatPhone(user.phone!))
        }
    }, [user])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
            <TouchableOpacity style={styles.logout} onPress={handleSignOut}>
                <FontAwesome name="sign-out" size={30} color={iconColor} />
            </TouchableOpacity>
            <View style={[styles.container, { backgroundColor: bgColor }]}>
                <View style={[styles.profile, { backgroundColor: bgColor }]}>
                    <TouchableOpacity
                        onPress={() => {
                            // handle onPress
                            router.push('/(app)/(nova)/myinfo')
                        }}
                    >
                        <View style={styles.profileAvatarWrapper}>
                            <Image
                                alt=""
                                source={{
                                    uri:
                                        user?.image ||
                                        'https://firebasestorage.googleapis.com/v0/b/ayuda-b2079.appspot.com/o/verizon.png?alt=media&token=4d4c0560-4c17-4bc4-a73f-d4740312cb3c'
                                }}
                                style={styles.profileAvatar}
                            />

                            <TouchableOpacity
                                onPress={() => {
                                    bottomSheetRef.current?.snapToIndex(1)
                                }}
                            >
                                <View style={styles.profileAction}>
                                    <Feather
                                        color="#fff"
                                        name="edit-3"
                                        size={15}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>

                    <View>
                        <Text style={styles.profileName}>{user?.name}</Text>

                        <Text style={styles.profileAddress}>{user?.phone}</Text>
                        <Text style={styles.profileAddress}>{user?.email}</Text>
                        <Text style={styles.profileAddress}>
                            {user?.role === 'em'
                                ? 'Engagement Manager'
                                : user?.role === 'coach'
                                ? 'Coach'
                                : 'EM'}
                        </Text>
                    </View>
                </View>

                <ScrollView>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Manage</Text>
                        <TouchableOpacity
                            onPress={() => {
                                // handle onPress
                                router.push(
                                    '/(app)/(root)/(settings)/helpers/referees'
                                )
                            }}
                            style={[
                                styles.row,
                                { backgroundColor: secondaryColor }
                            ]}
                        >
                            <View
                                style={[
                                    styles.rowIcon,
                                    { backgroundColor: '#fe9400' }
                                ]}
                            >
                                <Feather color="#fff" name="users" size={20} />
                            </View>

                            <Text style={styles.rowLabel}>
                                My Referees / LA
                            </Text>

                            <View style={styles.rowSpacer} />

                            <Feather
                                color="#C6C6C6"
                                name="chevron-right"
                                size={20}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                // handle onPress
                                router.push(
                                    '/(app)/(root)/(settings)/helpers/managers'
                                )
                            }}
                            style={[
                                styles.row,
                                { backgroundColor: secondaryColor }
                            ]}
                        >
                            <View
                                style={[
                                    styles.rowIcon,
                                    { backgroundColor: 'lightblue' }
                                ]}
                            >
                                <Feather color="#fff" name="users" size={20} />
                            </View>

                            <Text style={styles.rowLabel}>
                                My Managers / CEs
                            </Text>

                            <View style={styles.rowSpacer} />

                            <Feather
                                color="#C6C6C6"
                                name="chevron-right"
                                size={20}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                // handle onPress
                                router.push(
                                    '/(app)/(root)/(settings)/helpers/coach'
                                )
                            }}
                            style={[
                                styles.row,
                                { backgroundColor: secondaryColor }
                            ]}
                        >
                            <View
                                style={[
                                    styles.rowIcon,
                                    { backgroundColor: 'lightblue' }
                                ]}
                            >
                                <Feather color="#fff" name="user" size={20} />
                            </View>

                            <Text style={styles.rowLabel}>My Coach</Text>

                            <View style={styles.rowSpacer} />

                            <Feather
                                color="#C6C6C6"
                                name="chevron-right"
                                size={20}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Preferences</Text>
                        <View
                            style={[
                                styles.row,
                                { backgroundColor: secondaryColor }
                            ]}
                        >
                            <View
                                style={[
                                    styles.rowIcon,
                                    { backgroundColor: '#007afe' }
                                ]}
                            >
                                <Feather color="#fff" name="moon" size={20} />
                            </View>

                            <Text style={styles.rowLabel}>Themes</Text>

                            <View style={styles.rowSpacer} />

                            <ThemeSwitcher
                                containerStyle={{
                                    flexGrow: 0.1,
                                    height: 50,
                                    alignSelf: 'flex-end',
                                    backgroundColor: secondaryColor
                                }}
                                small
                            />
                        </View>

                        <View
                            style={[
                                styles.row,
                                { backgroundColor: secondaryColor }
                            ]}
                        >
                            <View
                                style={[
                                    styles.rowIcon,
                                    { backgroundColor: '#38C959' }
                                ]}
                            >
                                <Feather color="#fff" name="bell" size={20} />
                            </View>

                            <Text style={styles.rowLabel}>
                                Push Notifications
                            </Text>

                            <View style={styles.rowSpacer} />

                            <Switch
                                onValueChange={(pushNotifications) =>
                                    handlePushNotificationChange(
                                        pushNotifications
                                    )
                                }
                                value={user?.pushToken !== null}
                            />
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Actions</Text>
                        <View
                            style={[
                                styles.row,
                                { backgroundColor: secondaryColor }
                            ]}
                        >
                            <View
                                style={[
                                    styles.rowIcon,
                                    { backgroundColor: '#38C959' }
                                ]}
                            >
                                <Feather
                                    color="#fff"
                                    name="at-sign"
                                    size={20}
                                />
                            </View>

                            <Text style={styles.rowLabel}>Show 5G</Text>

                            <View style={styles.rowSpacer} />

                            <Switch
                                onValueChange={(show) => {
                                    dispatch(setShow5G(show))
                                }}
                                value={show5G}
                            />
                        </View>
                        <View
                            style={[
                                styles.row,
                                { backgroundColor: secondaryColor }
                            ]}
                        >
                            <View
                                style={[
                                    styles.rowIcon,
                                    { backgroundColor: '#38C959' }
                                ]}
                            >
                                <Feather
                                    color="#fff"
                                    name="bookmark"
                                    size={20}
                                />
                            </View>

                            <Text style={styles.rowLabel}>Save Contact</Text>

                            <View style={styles.rowSpacer} />

                            <Switch
                                onValueChange={(save) => {
                                    dispatch(setSaveContact(save))
                                }}
                                value={saveContact}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Resources</Text>
                        <TouchableOpacity
                            onPress={() => {
                                // handle onPress
                                router.push('/(app)/(root)/(settings)/numbers')
                            }}
                            style={[
                                styles.row,
                                { backgroundColor: secondaryColor }
                            ]}
                        >
                            <View
                                style={[
                                    styles.rowIcon,
                                    { backgroundColor: 'green' }
                                ]}
                            >
                                <Feather
                                    color="#fff"
                                    name="phone-incoming"
                                    size={20}
                                />
                            </View>

                            <Text style={styles.rowLabel}>Useful Numbers</Text>

                            <View style={styles.rowSpacer} />

                            <Feather
                                color="#C6C6C6"
                                name="chevron-right"
                                size={20}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                // handle onPress
                                router.push('/(app)/(nova)/directory')
                            }}
                            style={[
                                styles.row,
                                { backgroundColor: secondaryColor }
                            ]}
                        >
                            <View
                                style={[
                                    styles.rowIcon,
                                    { backgroundColor: 'purple' }
                                ]}
                            >
                                <Entypo name="book" size={24} color="#ffffff" />
                            </View>

                            <Text style={styles.rowLabel}>Directory</Text>

                            <View style={styles.rowSpacer} />

                            <Feather
                                color="#C6C6C6"
                                name="chevron-right"
                                size={20}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                // handle onPress
                                Alert.alert('Upcoming feature')
                            }}
                            style={[
                                styles.row,
                                { backgroundColor: secondaryColor }
                            ]}
                        >
                            <View
                                style={[
                                    styles.rowIcon,
                                    { backgroundColor: '#8e8d91' }
                                ]}
                            >
                                <Feather color="#fff" name="flag" size={20} />
                            </View>

                            <Text style={styles.rowLabel}>Report Bug</Text>

                            <View style={styles.rowSpacer} />

                            <Feather
                                color="#C6C6C6"
                                name="chevron-right"
                                size={20}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                // handle onPress
                                Alert.alert('Upcoming feature')
                            }}
                            style={[
                                styles.row,
                                { backgroundColor: secondaryColor }
                            ]}
                        >
                            <View
                                style={[
                                    styles.rowIcon,
                                    { backgroundColor: '#007afe' }
                                ]}
                            >
                                <Feather color="#fff" name="mail" size={20} />
                            </View>

                            <Text style={styles.rowLabel}>Contact Us</Text>

                            <View style={styles.rowSpacer} />

                            <Feather
                                color="#C6C6C6"
                                name="chevron-right"
                                size={20}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Extreme</Text>
                        <TouchableOpacity
                            onPress={() => {
                                // handle onPress
                                router.push('/(app)/(root)/(settings)/blocked')
                            }}
                            style={[
                                styles.row,
                                { backgroundColor: secondaryColor }
                            ]}
                        >
                            <View
                                style={[
                                    styles.rowIcon,
                                    { backgroundColor: 'red' }
                                ]}
                            >
                                <Feather color="#fff" name="user-x" size={20} />
                            </View>

                            <Text style={styles.rowLabel}>Blocked Users</Text>

                            <View style={styles.rowSpacer} />

                            <Feather
                                color="#C6C6C6"
                                name="chevron-right"
                                size={20}
                            />
                        </TouchableOpacity>
                        <View
                            style={[
                                styles.row,
                                { backgroundColor: secondaryColor }
                            ]}
                        >
                            <View
                                style={[
                                    styles.rowIcon,
                                    { backgroundColor: 'red' }
                                ]}
                            >
                                <Feather color="#fff" name="x" size={20} />
                            </View>

                            <Text style={styles.rowLabel}>Delete Account</Text>

                            <View style={styles.rowSpacer} />

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
                        </View>
                    </View>
                </ScrollView>
            </View>
            <BottomSheet
                index={-1}
                snapPoints={snapoints}
                topInset={SIZES.statusBarHeight + SIZES.padding + 80}
                ref={bottomSheetRef}
                backdropComponent={renderBackdrop}
                style={{ flex: 1 }}
                backgroundStyle={{
                    backgroundColor: bgColor
                }}
                overDragResistanceFactor={5}
                handleIndicatorStyle={{ backgroundColor: 'gray' }}
                handleStyle={{ backgroundColor: bgColor }}
            >
                <View style={{ padding: SIZES.padding, flex: 1 }}>
                    <View>
                        <Text fontFamily="QSBold">Full Name</Text>
                        <BottomSheetTextInput
                            style={{
                                marginTop: 10,
                                marginBottom: 10,
                                borderRadius: 10,
                                fontSize: 16,
                                lineHeight: 20,
                                padding: SIZES.base,
                                backgroundColor: 'rgba(151, 151, 151, 0.25)'
                            }}
                            defaultValue={user?.name}
                            placeholder="Joe Smith"
                            autoCapitalize="words"
                            value={name}
                            autoFocus
                            onChangeText={(text) => {
                                setName(text)
                            }}
                        />
                    </View>
                    <View>
                        <Text fontFamily="QSBold">Phone</Text>
                        <BottomSheetTextInput
                            style={{
                                marginTop: 10,
                                marginBottom: 30,
                                borderRadius: 10,
                                fontSize: 16,
                                lineHeight: 20,
                                padding: SIZES.base,
                                backgroundColor: 'rgba(151, 151, 151, 0.25)'
                            }}
                            defaultValue={user?.phone!}
                            placeholder="Cell Phone Number"
                            value={phone}
                            autoFocus
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                setPhone(formatPhone(text))
                            }}
                        />
                        <Row
                            style={{
                                alignSelf: 'center',
                                gap: SIZES.padding * 2
                            }}
                        >
                            <Button
                                title="Cancel"
                                color={'orange'}
                                onPress={resetForm}
                            />
                            <Button
                                title="Update"
                                disabled={!name || !phone}
                                onPress={() => {
                                    if (!isFullName(name)) {
                                        Alert.alert(
                                            'Invalid name',
                                            'You must write your full name'
                                        )
                                        return
                                    }
                                    if (phone.length !== 14) {
                                        Alert.alert('Invalid phone number')
                                        return
                                    }
                                    console.log(name, phone)

                                    Alert.alert(
                                        'Name and Phone Updates',
                                        'Are you sure that you want to update this info',
                                        [
                                            { text: 'Cancel' },
                                            {
                                                text: 'Yes, I am sure',
                                                onPress: async () => {
                                                    try {
                                                        if (!user) return
                                                        dispatch(
                                                            updateUser({
                                                                ...user,
                                                                phone,
                                                                name
                                                            })
                                                        )
                                                        resetForm()
                                                    } catch (error) {
                                                        console.log(
                                                            'Error updating info'
                                                        )
                                                    }
                                                }
                                            }
                                        ]
                                    )
                                }}
                            />
                        </Row>
                    </View>
                </View>
            </BottomSheet>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0
    },
    /** Profile */
    profile: {
        padding: 24,

        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileAvatarWrapper: {
        position: 'relative'
    },
    profileAvatar: {
        width: 96,
        height: 96,
        borderRadius: 9999
    },
    profileAction: {
        position: 'absolute',
        right: -4,
        bottom: -10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: 9999,
        backgroundColor: '#007bff'
    },
    profileName: {
        marginTop: 12,
        fontSize: 19,
        fontWeight: '600',
        textAlign: 'center'
    },
    profileAddress: {
        marginTop: 5,
        fontSize: 16,
        color: '#989898',
        textAlign: 'center'
    },
    logout: {
        position: 'absolute',
        right: 20,
        top: SIZES.statusBarHeight,
        zIndex: 100
    },
    /** Section */
    section: {
        paddingHorizontal: 24
    },
    sectionTitle: {
        paddingVertical: 12,
        fontSize: 12,
        fontWeight: '600',
        color: '#9e9e9e',
        textTransform: 'uppercase',
        letterSpacing: 1.1
    },
    /** Row */
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 50,

        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 12
    },
    rowIcon: {
        width: 32,
        height: 32,
        borderRadius: 9999,
        marginRight: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowLabel: {
        fontSize: 17,
        fontWeight: '400'
    },
    rowSpacer: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0
    }
})
