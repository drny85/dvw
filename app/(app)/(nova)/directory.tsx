import Loading from '@/common/components/Loading'
import Row from '@/common/components/Row'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import { useNavigationSearch } from '@/common/hooks/useNavigationSearch'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { AppUser } from '@/types'
import { usersCollection } from '@/utils/collections'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import { getDocs, onSnapshot, query, where } from 'firebase/firestore'
import React, { useEffect, useMemo, useState } from 'react'
import {
    Alert,
    FlatList,
    Image,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import Communications from 'react-native-communications'
import * as Linking from 'expo-linking'
import * as Clipboard from 'expo-clipboard'
import useAppSelector from '@/common/hooks/useAppSelector'

const Directory = () => {
    const ascent = useThemeColor('accent')
    const background = useThemeColor('background')
    const secondary = useThemeColor('white')
    const user = useAppSelector((s) => s.auth.user)
    const [users, setUsers] = useState<AppUser[]>([])

    const [loading, setLoading] = useState<boolean>(true)
    const search = useNavigationSearch({
        searchBarOptions: {
            placeholder: 'Search',
            tintColor: secondary,
            barTintColor: background
        }
    })
    const directory = useMemo(() => {
        if (!search) return users
        return users.filter((d) =>
            d.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [users, search])

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

    useEffect(() => {
        const docQuery = query(
            usersCollection,
            where('emailVerified', '==', true)
        )

        return onSnapshot(docQuery, (d) => {
            const results = d.docs
                .filter((u) => u.id !== user?.id)
                .map((doc) => ({ ...doc.data() }))
            setUsers(results)
            setLoading(false)
        })
    }, [])

    if (loading) return <Loading />
    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={{ flex: 1 }}
                contentInsetAdjustmentBehavior="automatic"
            >
                <FlatList
                    scrollEnabled={false}
                    data={directory.sort((a, b) =>
                        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
                    )}
                    contentContainerStyle={{
                        padding: SIZES.base,
                        gap: SIZES.padding,
                        marginBottom: 20
                    }}
                    renderItem={({ item }) => (
                        <Row
                            style={{
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flex: 1,
                                shadowOffset: {
                                    width: 2,
                                    height: 4
                                },
                                shadowColor: '#000',
                                shadowOpacity: 0.2,
                                backgroundColor: background,
                                borderRadius: SIZES.base,
                                padding: SIZES.base,
                                elevation: 6
                            }}
                        >
                            <Row>
                                <View
                                    style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: 6,
                                        backgroundColor: item.isOnline
                                            ? 'green'
                                            : '#e63946'
                                    }}
                                />
                                <Image
                                    source={{
                                        uri:
                                            item.image ||
                                            'https://www.edigitalagency.com.au/wp-content/uploads/verizon-red-icon-black-1200x1200.png'
                                    }}
                                    resizeMode="cover"
                                    width={50}
                                    height={50}
                                    style={{
                                        borderRadius: 25,
                                        marginHorizontal: SIZES.base
                                    }}
                                />
                                <Text capitalize>{item.name}</Text>
                            </Row>

                            <View>
                                <Row
                                    style={{
                                        gap: SIZES.padding,
                                        flex: 0.4
                                    }}
                                >
                                    {item.phone && (
                                        <TouchableOpacity
                                            onPress={() =>
                                                makeCall(item.phone!)
                                            }
                                        >
                                            <FontAwesome
                                                name="phone"
                                                size={22}
                                            />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        onLongPress={() =>
                                            onPaste(item.email!, item.name)
                                        }
                                        onPress={() => sendEmail(item.email!)}
                                    >
                                        <FontAwesome
                                            name="envelope"
                                            size={22}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() =>
                                            sendMessage(item.phone!, item.name)
                                        }
                                    >
                                        <AntDesign
                                            name="message1"
                                            size={22}
                                            color={ascent}
                                        />
                                    </TouchableOpacity>
                                </Row>
                            </View>
                        </Row>
                    )}
                />
            </ScrollView>
        </View>
    )
}

export default Directory
