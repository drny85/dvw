import { setDueToday } from '@/features/wireless/wirelessSlide'
import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    Button
} from 'react-native'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated'

type StateTax = {
    state: string
    taxRate: number
}
const HEIGHT = 48

const taxRates: StateTax[] = [
    { state: 'New York City', taxRate: 8.875 },
    { state: 'Westchester County', taxRate: 8.375 },
    { state: 'Massachusetts', taxRate: 6.25 },
    { state: 'New Jersey', taxRate: 6.625 }
]

interface StateTaxComponentProps {
    amount: number
    visible: boolean
    onClose: () => void
}

const StateTaxComponent: React.FC<StateTaxComponentProps> = ({
    amount,
    visible,
    onClose
}) => {
    const [selectedState, setSelectedState] = useState<StateTax>(taxRates[0])
    const [calculatedTax, setCalculatedTax] = useState<number>(0)
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const dropdownHeight = useSharedValue(0)

    const animatedDropdownStyle = useAnimatedStyle(() => {
        return {
            height: withTiming(dropdownHeight.value)
        }
    })

    const toggleDropdown = () => {
        setDropdownVisible((prev) => {
            if (!prev) {
                dropdownHeight.value = 0
            } else {
                dropdownHeight.value = taxRates.length * HEIGHT
            }
            return !prev
        })
    }

    const handleTaxCalculation = (state: StateTax) => {
        const taxAmount = (amount * state.taxRate) / 100
        setCalculatedTax(taxAmount)
        setDueToday(taxAmount)
        setSelectedState(state)

        toggleDropdown() // Close dropdown after selection
    }

    useEffect(() => {
        handleTaxCalculation(selectedState)
    }, [selectedState, amount])

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalBackdrop}>
                <Animated.View style={styles.modalContent}>
                    <Text style={styles.label}>Select a State:</Text>
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={toggleDropdown}
                    >
                        <Text style={styles.dropdownButtonText}>
                            {selectedState.state}
                        </Text>
                    </TouchableOpacity>

                    <Animated.View
                        style={[styles.dropdown, animatedDropdownStyle]}
                    >
                        <FlatList
                            data={taxRates.sort((a, b) =>
                                a.state.toLowerCase() > b.state.toLowerCase()
                                    ? 1
                                    : -1
                            )}
                            keyExtractor={(item) => item.state}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        handleTaxCalculation(item)
                                        setDropdownVisible(false)
                                    }}
                                >
                                    <Text style={styles.dropdownItemText}>
                                        {item.state}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </Animated.View>

                    <Text style={styles.label}>
                        Amount: ${amount.toFixed(2)}
                    </Text>
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <Text style={styles.label}>
                            Tax:
                            <Text style={{ fontSize: 13, color: 'grey' }}>
                                ({selectedState.taxRate}%)
                            </Text>
                        </Text>
                        <Text style={styles.label}>
                            ${calculatedTax.toFixed(2)}
                        </Text>
                    </View>

                    <Text
                        style={[
                            styles.label,
                            { fontSize: 24, fontWeight: 'bold' }
                        ]}
                    >
                        Due Total: ${calculatedTax.toFixed(2)}
                    </Text>

                    <Button title="Close" onPress={onClose} />
                    <Text
                        style={{
                            marginTop: 20,
                            fontSize: 14,
                            fontStyle: 'italic'
                        }}
                    >
                        <Text style={{ fontWeight: '700' }}>Note:</Text> this
                        might be the right amount but always assume that is an
                        estimated.
                    </Text>
                </Animated.View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)' // Backdrop
    },
    modalContent: {
        width: '100%',
        height: '80%', // 80% of screen height
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        fontSize: 16,
        marginBottom: 10
    },
    dropdownButton: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10
    },
    dropdownButtonText: {
        fontSize: 18
    },
    dropdown: {
        backgroundColor: '#fff',
        overflow: 'hidden',
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10
    },
    dropdownItem: {
        padding: 10,
        height: HEIGHT,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    },
    dropdownItemText: {
        fontSize: 16
    }
})

export default StateTaxComponent
