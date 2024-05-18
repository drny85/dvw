import { Alert, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Row from './Row'
import { SIZES } from '@/constants/Sizes'
import { AppUser } from '@/types'
import View from './View'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import useThemeColor from '../hooks/useThemeColor'
import Text from './Text'
import * as Clipboard from 'expo-clipboard'
import * as Linking from 'expo-linking'
import Communications from 'react-native-communications'

type Props = {
    user: AppUser
}

const DirectoryListItem = ({ user }: Props) => {
    const background = useThemeColor('background')
    const ascent = useThemeColor('accent')
    const color = useThemeColor('text')

    const makeCall = (phone: string) => {
        const number = phone.replace(/[^0-9]/g, '').trim()
        if (!number) return

        Linking.canOpenURL(`tel:+1${number}`)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(`tel:+1${number}`)
                } else {
                    console.log("Don't know how to open URI: " + number)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const sendMessage = (phone: string, name: string) => {
        const number = phone.replace(/[^0-9]/g, '').trim()
        if (!number) return

        console.log(number)
        try {
            Communications.text(number, `Hi ${name.split(' ')[0]}, \n \n`)
        } catch (error) {
            console.log(error)
        }
    }

    const onPaste = async (email: string, name: string) => {
        try {
            if (!email || !name) return
            await Clipboard.setStringAsync(email)
            Alert.alert(
                'Email Copied',
                `${
                    name.split(' ')[0]
                }'s email was copied, go ahead and paste it as your email recipient`
            )
        } catch (error) {
            console.log(error)
        }
    }

    const sendEmail = (email: string) => {
        if (!email) return

        Linking.canOpenURL(`mailto:${email}`)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(`mailto:${email}`)
                } else {
                    console.log("Don't know how to open URI: " + email)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    return (
        <Row
            style={[
                styles.container,
                {
                    backgroundColor: background
                }
            ]}
        >
            <Row>
                <View
                    style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: user.isOnline ? 'green' : '#e63946'
                    }}
                />
                <Image
                    source={
                        user?.image
                            ? {
                                  uri: user?.image
                              }
                            : require('@/assets/images/verizon.png')
                    }
                    resizeMode="cover"
                    style={{
                        borderRadius: 25,
                        marginHorizontal: SIZES.base,
                        height: 50,
                        width: 50
                    }}
                />
                <Text capitalize>{user.name}</Text>
            </Row>

            <View>
                <Row
                    style={{
                        gap: SIZES.padding,
                        flex: 0.4
                    }}
                >
                    {user.phone && (
                        <TouchableOpacity onPress={() => makeCall(user.phone!)}>
                            <FontAwesome name="phone" size={22} color={color} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onLongPress={() => onPaste(user.email!, user.name)}
                        onPress={() => sendEmail(user.email!)}
                    >
                        <FontAwesome name="envelope" size={22} color={color} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => sendMessage(user.phone!, user.name)}
                    >
                        <AntDesign name="message1" size={22} color={ascent} />
                    </TouchableOpacity>
                </Row>
            </View>
        </Row>
    )
}

export default DirectoryListItem

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        shadowOffset: {
            width: 2,
            height: 4
        },
        shadowColor: '#000',
        shadowOpacity: 0.2,

        borderRadius: SIZES.base,
        padding: SIZES.base,
        elevation: 6
    }
})
