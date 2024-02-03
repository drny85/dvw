import { TouchableHighlight, Modal, Platform } from 'react-native'
import React from 'react'

import DateTimePicker, {
    DateTimePickerEvent
} from '@react-native-community/datetimepicker'
import Text from './Text'
import moment from 'moment'
import View from './View'
import { SIZES } from '@/constants/Sizes'
import useThemeColor from '../hooks/useThemeColor'

interface Props {
    show: boolean
    setShow: () => void
    onChange: (event: DateTimePickerEvent, date: Date | undefined) => void
    date: string
    maxDate?: string
    minDate?: string
}
const DateModal = ({
    show,
    setShow,
    onChange,
    date,
    maxDate,
    minDate
}: Props) => {
    const ascent = useThemeColor('accent')
    const btn = useThemeColor('button')
    const secondary = useThemeColor('placeholder')
    const textColor = useThemeColor('text')
    const bgColor = useThemeColor('background')

    if (show && Platform.OS === 'android') {
        return (
            <DateTimePicker
                locale="en_US"
                accentColor={ascent}
                textColor={textColor}
                style={{
                    width: '90%',
                    alignSelf: 'center',
                    height: '90%',
                    backgroundColor: bgColor,
                    borderRadius: SIZES.radius,
                    overflow: 'hidden'
                }}
                testID="dateTimePicker"
                value={
                    date
                        ? new Date(date)
                        : new Date(moment().format('YYYY-MM-DD'))
                }
                minimumDate={
                    minDate
                        ? new Date(moment(minDate).format('YYYY-MM-DD'))
                        : new Date(
                              moment().subtract(3, 'weeks').format('YYYY-MM-DD')
                          )
                }
                maximumDate={
                    maxDate
                        ? new Date(
                              moment(maxDate).add(1, 'day').format('YYYY-MM-DD')
                          )
                        : new Date(
                              moment().add(3, 'months').format('YYYY-MM-DD')
                          )
                }
                mode={'date'}
                display={'default'}
                onChange={(event, date) => onChange(event, date)}
            />
        )
    }
    return (
        <Modal
            transparent
            animationType="slide"
            visible={show && Platform.OS !== 'android'}
        >
            <TouchableHighlight
                underlayColor={'#0e0d0d5c'}
                onPress={setShow}
                style={{ flex: 1, backgroundColor: '#212121b5', zIndex: -10 }}
            >
                <View
                    style={{
                        backgroundColor: ascent,
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: SIZES.height * 0.7,
                        bottom: 0,
                        borderTopLeftRadius: SIZES.radius * 3,
                        borderTopRightRadius: SIZES.radius * 3
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingVertical: SIZES.padding,
                            justifyContent: 'space-between',
                            marginHorizontal: SIZES.padding * 2
                        }}
                    >
                        <TouchableHighlight
                            activeOpacity={0}
                            underlayColor={btn}
                            onPress={setShow}
                        >
                            <Text color="border">Cancel</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={btn}
                            onPress={setShow}
                        >
                            <Text color="white">Done</Text>
                        </TouchableHighlight>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            marginBottom: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: secondary
                        }}
                    >
                        {Platform.OS === 'ios' && (
                            <DateTimePicker
                                locale="en_US"
                                accentColor={ascent}
                                textColor={textColor}
                                style={{
                                    width: '90%',
                                    alignSelf: 'center',
                                    height: '90%',
                                    backgroundColor: bgColor,
                                    borderRadius: SIZES.radius,
                                    overflow: 'hidden'
                                }}
                                testID="dateTimePicker_move"
                                value={
                                    date
                                        ? new Date(date)
                                        : new Date(
                                              moment().format('YYYY-MM-DD')
                                          )
                                }
                                minimumDate={
                                    minDate
                                        ? new Date(
                                              moment(minDate).format(
                                                  'YYYY-MM-DD'
                                              )
                                          )
                                        : new Date(
                                              moment()
                                                  .subtract(3, 'weeks')
                                                  .format('YYYY-MM-DD')
                                          )
                                }
                                maximumDate={
                                    maxDate
                                        ? new Date(
                                              moment(maxDate)
                                                  .add(1, 'day')
                                                  .format('YYYY-MM-DD')
                                          )
                                        : new Date(
                                              moment()
                                                  .add(3, 'months')
                                                  .format('YYYY-MM-DD')
                                          )
                                }
                                mode={'date'}
                                display={
                                    Platform.OS === 'ios' ? 'inline' : 'default'
                                }
                                onChange={onChange}
                            />
                        )}
                    </View>
                </View>
            </TouchableHighlight>
        </Modal>
    )
}

export default DateModal
