import React, { useState, FC } from 'react'
import { View, Button, Platform } from 'react-native'
import DateTimePicker, {
    DateTimePickerEvent,
    BaseProps
} from '@react-native-community/datetimepicker'
import useThemeColor from '../hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'

type IOSMode = 'date' | 'time' | 'datetime' | 'countdown'
type TimeOptions = {
    minuteInterval?: number
}
type Base = BaseProps & TimeOptions

interface Props extends Base {
    mode: IOSMode
    value: Date
    onDateChange: (date: Date) => void
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
                    minimumDate={new Date()}
                    minuteInterval={15}
                    display="default"
                    onChange={handleDateChange}
                    textColor={textColor}
                    style={{
                        backgroundColor: bgColor,
                        borderRadius: SIZES.radius
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
