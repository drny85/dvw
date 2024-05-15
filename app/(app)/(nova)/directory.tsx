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
import { getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useMemo, useState } from 'react'
import { FlatList, Image, ScrollView, TouchableOpacity } from 'react-native'

import * as Linking from 'expo-linking'

const Directory = () => {
    const ascent = useThemeColor('accent')
    const background = useThemeColor('background')
    const secondary = useThemeColor('white')
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
    const sendMessage = (phone: string) => {
        const number = phone.replace(/[^0-9]/g, '').trim()
        if (!number) return

        Linking.canOpenURL(`sms:+1${number}`)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(`sms:+${number}`)
                } else {
                    console.log("Don't know how to open URI: " + number)
                }
            })
            .catch((error) => {
                console.log(error)
            })
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
        const getUsers = async () => {
            try {
                const docQuery = query(
                    usersCollection,
                    where('emailVerified', '==', true)
                )
                const d = await getDocs(docQuery)
                const results = d.docs.map((doc) => ({ ...doc.data() }))
                setUsers(results)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        getUsers()
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
                    data={directory.sort((a, b) => (a.name > b.name ? 1 : -1))}
                    contentContainerStyle={{
                        padding: SIZES.base,
                        gap: SIZES.padding
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
                                        marginRight: SIZES.base
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
                                    <TouchableOpacity
                                        onPress={() => makeCall(item.phone!)}
                                    >
                                        <FontAwesome name="phone" size={22} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => sendEmail(item.email!)}
                                    >
                                        <FontAwesome
                                            name="envelope"
                                            size={22}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => sendMessage(item.phone!)}
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
