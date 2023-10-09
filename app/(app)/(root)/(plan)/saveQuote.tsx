import Header from '@/common/components/Header'
import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import TextInput from '@/common/components/TextInput'
import View from '@/common/components/View'
import useAppSelector from '@/common/hooks/useAppSelector'
import { SIZES } from '@/constants/Sizes'
import { formatPhone } from '@/utils/formatPhone'
import { isEmailValid } from '@/utils/isEmailValid'
import { isFullName } from '@/utils/isFullName'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Button, ScrollView, StyleSheet } from 'react-native'

import TotalView from '@/common/components/myPlan/TotalView'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useThemeColor from '@/common/hooks/useThemeColor'
import Styles from '@/constants/Styles'
import { saveWirelessQuote } from '@/features/wirelessQuotes/wirelessQuoteActions'
import { WirelessQuote } from '@/types'
import { onlyLetters } from '@/utils/onlyLetters'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { v4 } from 'uuid'
import { sendEmail } from '@/firebase'
import Loading from '@/common/components/Loading'

const SaveQuote = () => {
    const [inReview, setReview] = useState(true)
    const [loading, setLoading] = useState(false)
    const user = useAppSelector((s) => s.auth.user)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [phone, setPhone] = useState('')
    const bgColor = useThemeColor('primary')
    const dispatch = useAppDispatch()

    const {
        lines,
        expressAutoPay,
        expressFirstResponder,
        expressHasFios,
        expressInternet
    } = useAppSelector((s) => s.wireless)

    const onSaveQuote = async () => {
        if (!isFullName(name)) {
            Alert.alert('Please enter a valid name')
            return
        }
        if (phone.length < 14) {
            Alert.alert('Please enter a valid phone number')
            return
        }
        if (!isEmailValid(email)) {
            Alert.alert('Please enter a valid email')
            return
        }

        if (message.length < 3) {
            Alert.alert('Please a message or description')
            return
        }

        const quote: WirelessQuote = {
            id: v4(),
            lines,
            userId: user?.id!,
            createdAt: new Date().toISOString(),
            customerName: name,
            email,
            phoneNumber: phone,
            status: 'pending',
            isAutoPay: expressAutoPay === 10,
            isFirstResponder: expressFirstResponder,
            hasFios: expressHasFios,
            internetPlan: expressInternet ? expressInternet : null,
            message
        }
        try {
            setLoading(true)
            const func = sendEmail()
            const res = await func({ quote })
            console.log(res)

            dispatch(saveWirelessQuote(quote))
            setName('')
            setEmail('')
            setPhone('')
            setMessage('')

            router.back()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Text fontSize={20}>Saving Qoute</Text>
            </View>
        )
    }

    return (
        <Screen>
            <Header
                title={inReview ? 'Quote Review' : 'Save Quote'}
                onPressBack={() => {
                    if (!inReview) {
                        setReview(true)
                    } else {
                        router.back()
                    }
                }}
            />

            {inReview && (
                <View style={{ flex: 1, padding: 20 }}>
                    <Text center fontSize={20} fontFamily="SFBold">
                        Number of Lines {lines.length}
                    </Text>
                    <View style={{ flex: 0.4 }}>
                        <ScrollView
                            contentContainerStyle={{
                                gap: SIZES.padding,
                                marginTop: SIZES.padding
                            }}
                        >
                            {lines.map((line, index) => (
                                <View
                                    key={line.id}
                                    style={[
                                        Styles.boxShadow,
                                        {
                                            backgroundColor: bgColor,
                                            borderRadius: SIZES.radius,
                                            padding: SIZES.base
                                        }
                                    ]}
                                >
                                    <View style={{ width: '100%' }}>
                                        <Row
                                            style={{
                                                justifyContent: 'space-between'
                                            }}
                                        >
                                            <Row>
                                                <Text>{index + 1} - </Text>
                                                <Text>{line.name}</Text>
                                            </Row>
                                            <Text>${line.price}</Text>
                                        </Row>
                                    </View>
                                    {line.perks
                                        .filter((p) => p.selected)
                                        .map((perk, i) => (
                                            <Row
                                                key={perk.name}
                                                style={{
                                                    justifyContent:
                                                        'space-between',
                                                    alignItems: 'center',
                                                    width: '90%',
                                                    alignSelf: 'center',
                                                    gap: SIZES.base,
                                                    padding: SIZES.base
                                                }}
                                            >
                                                <Row>
                                                    <Text>{i + 1} - </Text>
                                                    <Text
                                                        fontSize={12}
                                                        capitalize
                                                    >
                                                        {perk.name}
                                                    </Text>
                                                </Row>
                                                <Row
                                                    style={{ gap: SIZES.base }}
                                                >
                                                    <Text fontSize={12}>
                                                        (value ${perk.value})
                                                    </Text>
                                                    <Text fontSize={12}>
                                                        ${perk.price}
                                                    </Text>
                                                </Row>
                                            </Row>
                                        ))}
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                    <View style={{ flex: 0.5, marginTop: 20 }}>
                        <TotalView onClickSave={() => setReview(false)} />
                    </View>
                </View>
            )}
            {!inReview && (
                <KeyboardAwareScrollView
                    style={{ flex: 1 }}
                    keyboardDismissMode="on-drag"
                    extraHeight={20}
                    contentContainerStyle={{ flex: 1 }}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            padding: 20,
                            width: '100%',
                            gap: SIZES.padding * 2
                        }}
                    >
                        <TextInput
                            placeholder="Customer's Full Name"
                            value={name}
                            onChangeText={(text) => setName(onlyLetters(text))}
                            autoCapitalize="words"
                        />

                        <TextInput
                            placeholder="Customer's Phone #"
                            value={phone}
                            onChangeText={(text) => setPhone(formatPhone(text))}
                            keyboardType="numeric"
                        />

                        <TextInput
                            placeholder="Customer's Email"
                            value={email}
                            keyboardType="email-address"
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />

                        <TextInput
                            placeholder="Type a message or description"
                            value={message}
                            onChangeText={setMessage}
                            isMultiline={true}
                            autoCapitalize="none"
                        />

                        <Button title="Save Quote" onPress={onSaveQuote} />
                    </View>
                </KeyboardAwareScrollView>
            )}
        </Screen>
    )
}

export default SaveQuote

const styles = StyleSheet.create({})
