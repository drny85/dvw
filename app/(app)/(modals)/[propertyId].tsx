import React from 'react'
import Screen from '@/common/components/Screen'

import Header from '@/common/components/Header'
import { router, useLocalSearchParams } from 'expo-router'
import { ScrollView } from 'react-native'
import { useProperty } from '@/common/hooks/properties/useProperty'
import Loading from '@/common/components/Loading'

const PropertyDetails = () => {
    const { propertyId } = useLocalSearchParams<{ propertyId: string }>()
    const { property, loading } = useProperty(propertyId)
    if (loading) return <Loading />
    return (
        <Screen>
            <Header
                onPressBack={router.back}
                title={property['VSS PROP NAME']}
            />
            <ScrollView></ScrollView>
        </Screen>
    )
}

export default PropertyDetails
