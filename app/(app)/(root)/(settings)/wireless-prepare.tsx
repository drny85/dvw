import Screen from '@/common/components/Screen'
import React, { useState } from 'react'
import { Alert, Button } from 'react-native'

import KeyboardScreen from '@/common/components/KeyboardScreen'
import Loading from '@/common/components/Loading'
import TextInput from '@/common/components/TextInput'
import { useUser } from '@/common/hooks/auth/useUser'
import { SIZES } from '@/constants/Sizes'
import { auth, sendPreparationEmail } from '@/firebase'
import { WelcomeEmailProps } from '@/types'
import { isEmailValid } from '@/utils/isEmailValid'
import { isFullName } from '@/utils/isFullName'
import Text from '@/common/components/Text'
import { router } from 'expo-router'
import View from '@/common/components/View'
import SegmentedControl from '@/common/components/SegmentedControl'

const carriers = ['AT&T', 'T-Mobile', 'Other']
type Carriers = 'AT&T' | 'T-Mobile' | 'Other'

const WirelessPrepare = () => {
    const { user } = useUser(auth.currentUser?.uid || '')
    const [loading, setLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState<Carriers>('Other')
    const [form, setForm] = useState<WelcomeEmailProps['customer']>({
        name: '',
        email: '',
        carrier: 'Other'
    })

    const handleEmailSend = async () => {
        try {
            if (!form.name || !form.email || !form.carrier) {
                return Alert.alert('Error', 'Please fill all fields')
            }
            if (!isFullName(form.name)) {
                return Alert.alert('Error', 'Please enter a valid full name')
            }

            if (!isEmailValid(form.email)) {
                return Alert.alert(
                    'Error',
                    'Please enter a valid email address'
                )
            }

            const { name, email, carrier } = form
            console.log(form)
            const data: WelcomeEmailProps = {
                customer: {
                    name,
                    email,
                    carrier
                },
                myInfo: {
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || ''

                    //#endregion
                }
            }
            setLoading(true)
            const res = await sendPreparationEmail(data)
            if (res.data) {
                Alert.alert('Success', 'Email sent successfully')
                setForm({
                    name: '',
                    email: '',
                    carrier: 'Other'
                })
                router.back()
            } else {
                Alert.alert('Error', 'Something went wrong')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loading />

    if (!user?.name)
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Text fontSize={26}>Profile no completed</Text>
            </View>
        )

    return (
        <Screen>
            <Text
                center
                fontFamily="QSBold"
                fontSize={22}
                style={{ marginVertical: 16 }}
            >
                Prepare Customer For Wireless Sale
            </Text>
            <KeyboardScreen
                containerStyle={{
                    gap: SIZES.padding * 2,
                    padding: SIZES.padding
                }}
            >
                <View style={{ gap: 8 }}>
                    <Text fontFamily="SFBold" fontSize={18}>
                        Customer's Full Name
                    </Text>
                    <TextInput
                        autoFocus
                        autoCapitalize="words"
                        placeholder="Full Name"
                        value={form.name}
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, name: text }))
                        }
                    />
                </View>
                <View style={{ gap: 8 }}>
                    <Text fontFamily="SFBold" fontSize={18}>
                        Customer's Email Address
                    </Text>
                    <TextInput
                        keyboardType="email-address"
                        value={form.email}
                        placeholder="Email Address"
                        autoCapitalize="none"
                        onChangeText={(text) =>
                            setForm((prev) => ({
                                ...prev,
                                email: text.toLowerCase()
                            }))
                        }
                    />
                </View>
                <View style={{ width: '100%', marginTop: 10, gap: 16 }}>
                    <Text center fontFamily="QSBold" fontSize={22}>
                        Customer is coming from?
                    </Text>
                    <SegmentedControl
                        containerStyle={{ width: '80%' }}
                        selectedIndex={carriers.indexOf(selectedIndex)}
                        values={carriers}
                        onChange={(value) => {
                            setSelectedIndex(value as Carriers)
                            setForm((prev) => ({
                                ...prev,
                                carrier: value as Carriers
                            }))
                        }}
                    />
                </View>
                <Button
                    disabled={loading}
                    title="Send Email"
                    color={'green'}
                    onPress={handleEmailSend}
                />
            </KeyboardScreen>
        </Screen>
    )
}

export default WirelessPrepare
