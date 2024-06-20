import { SIZES } from '@/constants/Sizes'
import { Line } from '@/types'
import React from 'react'
import { StyleSheet } from 'react-native'
import View from '../View'
import LineItem from './LineItem'

type Props = {
    lines: Line[]
    onBYOD: (id: string) => void
    onDelete: (id: string) => void
    onPerksPress: (id: string) => void
    onTradeInPress: (id: string, index: string) => void
}
const LinesContainer = ({
    lines,
    onBYOD,
    onDelete,
    onPerksPress,
    onTradeInPress
}: Props) => {
    return (
        <View style={styles.container}>
            {lines.map((line, index) => (
                <LineItem
                    key={line.id}
                    index={index}
                    onTradeInPress={(id) =>
                        onTradeInPress(id, index.toString())
                    }
                    line={line}
                    onBYOD={() => onBYOD(line.id)}
                    onDelete={() => onDelete(line.id)}
                    onPerksPress={(id) => onPerksPress(id)}
                />
            ))}
        </View>
    )
}

export default LinesContainer

const styles = StyleSheet.create({
    container: {
        padding: SIZES.base,
        gap: SIZES.padding
    },
    lineName: {
        flexDirection: 'row',
        gap: SIZES.base,
        alignItems: 'center',
        justifyContent: 'space-around'
    }
})
