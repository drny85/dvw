import React from 'react'
import { StyleSheet, Image } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

import useAppSelector from '../hooks/useAppSelector'
import Screen from './Screen'
import Text from './Text'
import View from './View'
import useThemeColor from '../hooks/useThemeColor'

const MyQRCodeInfo: React.FC = () => {
    const user = useAppSelector((s) => s.auth.user)
    const backgroundColor = useThemeColor('background')
    // Define your contact information
    const contactInfo = `
BEGIN:VCARD
VERSION:3.0
N:${user?.name.split(' ')[1]};${user?.name.split(' ')[0]}
FN:${user?.name}
EMAIL:${user?.email}
TEL:${user?.phone?.replace(/\D/g, '')}
PHOTO;TYPE=JPEG;VALUE=URL:${user?.image || ''}
END:VCARD
  `

    return (
        <Screen>
            <View style={[styles.container, { backgroundColor }]}>
                <QRCode
                    value={contactInfo}
                    size={200}
                    logo={require('@/assets/images/verizon.png')}
                    logoSize={60}
                />
                <Text center style={styles.title}>
                    Scan Me
                </Text>
            </View>
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        marginTop: 20
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20
    },
    name: {
        fontSize: 20,
        marginBottom: 10
    },
    info: {
        fontSize: 16,
        marginBottom: 5
    }
})

export default MyQRCodeInfo
