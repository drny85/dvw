import { SIZES } from '@/constants/Sizes'
import DateTimePicker, {
    BaseProps,
    DateTimePickerEvent
} from '@react-native-community/datetimepicker'
import React, { FC } from 'react'
import { Button, Platform, View } from 'react-native'
import useThemeColor from '../hooks/useThemeColor'

type IOSMode = 'date' | 'time' | 'datetime' | 'countdown'
type TimeOptions = {
    minuteInterval?: number
}
type Base = BaseProps & TimeOptions

interface Props extends Base {
    mode: IOSMode
    value: Date
    onDateChange: (date: Date) => void
    minimumDate?: Date
    maximumDate?: Date
    isVisible: boolean
    onVisibilityChange: (visible: boolean) => void
    is24Hrs?: boolean
}

const DateTimePickerComponent: FC<Props> = ({
    mode,
    value,
    onDateChange,
    isVisible,
    onVisibilityChange,
    minimumDate,
    maximumDate,
    is24Hrs
}) => {
    const textColor = useThemeColor('text')
    const bgColor = useThemeColor('placeholder')
    const handleDateChange = (
        event: DateTimePickerEvent,
        selectedDate: Date | undefined
    ) => {
        if (selectedDate) {
            onDateChange(selectedDate)
        }
        onVisibilityChange(false)
    }

    return (
        <View>
            {Platform.OS === 'ios' && isVisible && (
                <DateTimePicker
                    value={value}
                    mode={mode}
                    minimumDate={minimumDate ? minimumDate : new Date()}
                    maximumDate={maximumDate ? maximumDate : undefined}
                    minuteInterval={5}
                    display="default"
                    onChange={handleDateChange}
                    textColor={textColor}
                    style={{
                        backgroundColor: bgColor,
                        borderRadius: SIZES.radius,
                        overflow: 'hidden'
                    }}
                />
            )}

            {Platform.OS === 'android' && (
                <Button
                    title={`Pick ${mode === 'date' ? 'Date' : 'Time'}`}
                    onPress={() => onVisibilityChange(true)}
                />
            )}
        </View>
    )
}

export default DateTimePickerComponent
