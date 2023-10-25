import Divider from '@/common/components/Divider'
import Header from '@/common/components/Header'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import View from '@/common/components/View'
import { SIZES } from '@/constants/Sizes'
import React from 'react'
import { Button, ScrollView } from 'react-native'

type Props = {
    onAgreePress: () => void
    onCancelPress: () => void
}
const Eula = ({ onAgreePress, onCancelPress }: Props) => {
    return (
        <Screen>
            <Header titleFontSize={18} title="END-USER LICENSE AGREEMENT" />
            <Divider />
            <ScrollView
                contentContainerStyle={{
                    padding: SIZES.padding,
                    gap: SIZES.base,
                    marginVertical: 20
                }}
            >
                <Text>
                    END-USER LICENSE AGREEMENT (EULA) FOR CHAT APPLICATION
                </Text>
                <Text>
                    PLEASE READ THIS END-USER LICENSE AGREEMENT (EULA) CAREFULLY
                    BEFORE USING THE CHAT APPLICATION (THE "SOFTWARE"). THIS
                    EULA IS A LEGAL AGREEMENT BETWEEN YOU (EITHER AN INDIVIDUAL
                    OR A SINGLE ENTITY) AND [YOUR COMPANY NAME] ("LICENSEE") FOR
                    THE SOFTWARE PRODUCT IDENTIFIED ABOVE. BY INSTALLING,
                    COPYING, OR OTHERWISE USING THE SOFTWARE, YOU AGREE TO BE
                    BOUND BY THE TERMS OF THIS EULA. IF YOU DO NOT AGREE TO THE
                    TERMS OF THIS EULA, DO NOT INSTALL OR USE THE SOFTWARE.
                </Text>
                <Text fontFamily="SFBold">1. LICENSE GRANT</Text>
                <Text>
                    Licensee grants you a revocable, non-exclusive,
                    non-transferable, limited license to use the Software solely
                    for your personal or business purposes in accordance with
                    the terms of this EULA.
                </Text>
                <Text fontFamily="SFBold">2. RESTRICTIONS</Text>
                <View style={{ gap: SIZES.base }}>
                    <Text fontFamily="QSBold">You may not:</Text>
                    <Text>
                        a. Reverse engineer, decompile, disassemble, or attempt
                        to derive the source code of the Software.
                    </Text>
                    <Text>
                        b. Modify or create derivative works of the Software.
                    </Text>
                    <Text>
                        c. Remove, alter, or obscure any copyright, trademark,
                        or other proprietary notices from the Software.
                    </Text>
                    <Text>
                        d. Distribute, sublicense, lease, lend, or rent the
                        Software to any third party.
                    </Text>
                    <Text>
                        e. Use the Software for any unlawful, malicious, or
                        unethical purposes.
                    </Text>
                    <Text>
                        f. Use the Software to send or share content that is
                        illegal, harmful, threatening, abusive, obscene, or
                        otherwise objectionable.
                    </Text>
                    <Text>
                        g. Use profanity or engage in any form of abusive,
                        offensive, or inappropriate language while using the
                        Software. Licensee reserves the right to take
                        appropriate actions, including suspending or terminating
                        your access, for any violation of this policy.
                    </Text>
                    <Text>
                        h. Engage in any form of harassment, cyberbullying, or
                        threatening behavior towards other users. Licensee has a
                        zero-tolerance policy for abusive users and will take
                        appropriate actions, including suspending or terminating
                        their access.
                    </Text>
                </View>

                <Text fontFamily="SFBold">2. TERMINATION</Text>
                <Text>
                    This EULA is effective until terminated. Your rights under
                    this EULA will terminate automatically without notice if you
                    fail to comply with any of its terms. Upon termination, you
                    must cease all use of the Software and destroy all copies of
                    the Software in your possession.
                </Text>
                <Text fontFamily="SFBold">
                    BY CLICKING AGREE, YOU ACKNOWLEDGE THAT YOU HAVE READ AND
                    UNDERSTAND THIS EULA AND AGREE TO BE BOUND BY ITS TERMS.
                </Text>

                <View
                    style={{
                        marginVertical: 30,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly'
                    }}
                >
                    <Button
                        color="grey"
                        title="Do not agree"
                        onPress={onCancelPress}
                    />
                    <Button title="Agree" onPress={onAgreePress} />
                </View>
            </ScrollView>
        </Screen>
    )
}

export default Eula
