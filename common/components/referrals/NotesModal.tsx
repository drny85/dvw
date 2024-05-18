import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import {
    Button,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    TextInput,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native'
import View from '../View'
import useAppSelector from '@/common/hooks/useAppSelector'
import Text from '../Text'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import { setComment } from '@/features/referrals/referralsSlide'
import { FontAwesome } from '@expo/vector-icons'
import Styles from '@/constants/Styles'

type Props = {
    show: boolean
    setShow: (value: boolean) => void
    onDone: () => void
}
export default function NotesModal({ show, setShow, onDone }: Props) {
    const ascent = useThemeColor('accent')
    const textColor = useThemeColor('text')
    const dispatch = useAppDispatch()
    const backgroundColor = useThemeColor('background')
    const comment = useAppSelector((s) => s.referrals.comment)
    return (
        <Modal transparent animationType="slide" visible={show}>
            <TouchableHighlight
                underlayColor={'#0e0d0d5c'}
                activeOpacity={1}
                onPress={() => setShow(false)}
                style={{ flex: 1, backgroundColor: '#212121b5', zIndex: -10 }}
            >
                <View
                    style={{
                        backgroundColor: backgroundColor,
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: SIZES.height * 0.7,
                        bottom: 0,
                        borderTopLeftRadius: SIZES.radius * 3,
                        borderTopRightRadius: SIZES.radius * 3
                    }}
                >
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior="padding"
                        keyboardVerticalOffset={60}
                        contentContainerStyle={{ padding: SIZES.padding }}
                    >
                        <TouchableHighlight
                            underlayColor={backgroundColor}
                            activeOpacity={1}
                            style={{ flex: 1, borderRadius: SIZES.radius * 3 }}
                            onPress={Keyboard.dismiss}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    padding: SIZES.padding,
                                    marginTop: SIZES.padding * 2,
                                    gap: SIZES.padding
                                }}
                            >
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 10,
                                        zIndex: 10,
                                        ...Styles.boxShadow,
                                        backgroundColor,
                                        borderRadius: 16,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 32,
                                        height: 32
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => setShow(false)}
                                    >
                                        <FontAwesome
                                            name="close"
                                            size={20}
                                            color={textColor}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text fontFamily="QSBold">
                                    Comments or Notes
                                </Text>
                                <TextInput
                                    style={{
                                        borderRadius: SIZES.radius,
                                        borderColor: ascent,
                                        backgroundColor,
                                        borderWidth: 0.5,
                                        padding: SIZES.base,
                                        minHeight: 80,
                                        textAlign: 'left',
                                        fontSize: 16,
                                        color: textColor
                                    }}
                                    placeholderTextColor={ascent}
                                    value={comment || ''}
                                    onChangeText={(text) => {
                                        dispatch(setComment(text))
                                    }}
                                    multiline
                                    placeholder="Comments or Notes for this referral"
                                />
                                <Button title="Done" onPress={onDone} />
                            </View>
                        </TouchableHighlight>
                    </KeyboardAvoidingView>
                </View>
            </TouchableHighlight>
        </Modal>
    )
}
