import useAppSelector from '@/common/hooks/useAppSelector'
import React, { useEffect, useState } from 'react'

import Text from '../Text'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { SIZES } from '@/constants/Sizes'

const Greeting: React.FC = () => {
    const [greeting, setGreeting] = useState<string>('')
    const user = useAppSelector((s) => s.auth.user)

    useEffect(() => {
        const currentHour = new Date().getHours()
        let newGreeting = ''

        if (currentHour >= 5 && currentHour < 12) {
            newGreeting = 'Good morning'
        } else if (currentHour >= 12 && currentHour < 18) {
            newGreeting = 'Good afternoon'
        } else {
            newGreeting = 'Good evening'
        }

        setGreeting(newGreeting)
    }, [])

    return (
        <Animated.View entering={FadeInUp.duration(600)}>
            <Text fontFamily="QSBold" fontSize={18} center>
                {greeting}, {user?.name.split(' ')[0]}!
            </Text>
        </Animated.View>
    )
}

export default Greeting
