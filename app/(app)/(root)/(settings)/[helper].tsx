import Header from '@/common/components/Header'
import Loading from '@/common/components/Loading'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import TextInput from '@/common/components/TextInput'
import View from '@/common/components/View'
import useAppSelector from '@/common/hooks/useAppSelector'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'

import { helpersCollection } from '@/utils/collections'
import { Helper, UserRole } from '@/types'
import { formatPhone } from '@/utils/formatPhone'
import { isEmailValid } from '@/utils/isEmailValid'
import { isFullName } from '@/utils/isFullName'
import { router, useLocalSearchParams } from 'expo-router'
import { addDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { Alert, StyleSheet, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useHelpers } from '@/common/hooks/referrals/useHelpers'

const Person = () => {
    const user = useAppSelector((s) => s.auth.user)
    const { helper } = useLocalSearchParams<{ helper: UserRole }>()
    const { helpers, loading: ld } = useHelpers()

    const disabled =
        helpers?.filter(
            (item) => item.type === 'coach' && item.userId === user?.id
        ).length === 1 && helper === 'coach'

    const btn = useThemeColor('accent')
    const title =
        helper === 'ce'
            ? 'Manager / CE'
            : helper === 'referee'
            ? 'Referee / LA'
            : 'Coach'

    const [loading, setLoading] = useState(false)
    const [person, setPerson] = useState<Helper>({
        name: '',
        email: '',
        phone: '',
        type: helper,
        userId: user?.id!,
        addedOn: new Date().toISOString()
    })

    const onAddPerson = async () => {
        if (disabled) {
            Alert.alert('Error', 'You can only have one Coach')
            return
        }
        try {
            if (person.name && person.phone && person.email) {
                if (!isFullName(person.name)) {
                    Alert.alert('Error', 'Please enter a valid name')
                    return
                }
                if (person.phone.length < 14) {
                    Alert.alert('Error', 'Please enter a valid phone')
                    return
                }
                if (!isEmailValid(person.email)) {
                    Alert.alert('Error', 'Please enter a valid email')
                    return
                }

                setLoading(true)
            } else {
                Alert.alert('Error', 'Please fill all fields')
                return
            }
            if (!user?.id) return

            await addDoc(helpersCollection(user?.id), { ...person })
            setPerson({
                name: '',
                email: '',
                phone: '',
                type: helper,
                userId: user?.id!,
                addedOn: new Date().toISOString()
            })
            router.back()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    if (loading || ld) return <Loading />
    return (
        <Screen>
            <Header onPressBack={router.back} title={title} />
            <KeyboardAwareScrollView
                contentContainerStyle={{
                    gap: SIZES.base * 1.5,
                    padding: SIZES.padding
                }}
                extraHeight={60}
                automaticallyAdjustContentInsets
            >
                <View>
                    <Text fontFamily="SFBold" style={{ margin: SIZES.base }}>
                        Full Name
                    </Text>
                    <TextInput
                        placeholder="Full Name"
                        value={person.name}
                        autoCapitalize="words"
                        onChangeText={(text) =>
                            setPerson({ ...person, name: text })
                        }
                    />
                </View>
                <View>
                    <Text fontFamily="SFBold" style={{ margin: SIZES.base }}>
                        Phone Number
                    </Text>
                    <TextInput
                        placeholder="Phone Number"
                        value={person.phone}
                        keyboardType="number-pad"
                        onChangeText={(text) =>
                            setPerson({ ...person, phone: formatPhone(text) })
                        }
                    />
                </View>
                <View>
                    <Text fontFamily="SFBold" style={{ margin: SIZES.base }}>
                        Email Address
                    </Text>
                    <TextInput
                        placeholder="Email Address"
                        value={person.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={(text) =>
                            setPerson({ ...person, email: text.toLowerCase() })
                        }
                    />
                </View>
                <View>
                    <TouchableOpacity
                        style={{
                            backgroundColor: btn,
                            padding: SIZES.base,
                            borderRadius: SIZES.radius * 3,
                            marginTop: SIZES.padding,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={onAddPerson}
                    >
                        <Text fontFamily="SFBold" fontSize={20} color="white">
                            Add {title}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </Screen>
    )
}

export default Person

const styles = StyleSheet.create({})
