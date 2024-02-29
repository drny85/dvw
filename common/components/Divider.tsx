import React from 'react'
import View from './View'
import useThemeColor from '../hooks/useThemeColor'
import { ViewStyle } from 'react-native'

type Props = {
    small?: boolean
    height?: number
    containerStyle?: ViewStyle
}
const Divider = ({ small, height, containerStyle }: Props) => {
    const bg = useThemeColor('accent')
    return (
        <View
            style={[
                {
                    width: small ? '80%' : '100%',
                    marginHorizontal: small ? 0 : '5%',
                    marginTop: small ? 0 : '5%',
                    marginBottom: small ? 0 : '5%',
                    borderBottomWidth: 1,
                    borderBottomColor: bg,
                    alignSelf: 'center',
                    height: height ? height : 1
                },
                containerStyle
            ]}
        />
    )
}

export default Divider
