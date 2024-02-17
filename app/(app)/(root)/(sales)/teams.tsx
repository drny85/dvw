import React from 'react'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import { useCoachess } from '@/common/hooks/auth/useCoaches'
import Loading from '@/common/components/Loading'

const Teams = () => {
    const { coaches, loading } = useCoachess()

    if (loading) return <Loading />
    return (
        <Screen>
            <Text>Teams</Text>
        </Screen>
    )
}

export default Teams
