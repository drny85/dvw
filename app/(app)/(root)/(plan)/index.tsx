import My5GPlan from '@/common/components/myPlan/My5GPlan'
import MyPlan from '@/common/components/myPlan/MyPlan'
import useAppSelector from '@/common/hooks/useAppSelector'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

const PlanHome = () => {
    const show5G = useAppSelector((s) => s.settings.show5G)

    return (
        <Animated.View
            style={{ flex: 1 }}
            entering={FadeIn.duration(1000)}
            exiting={FadeOut.duration(1000)}
        >
            {show5G ? <My5GPlan /> : <MyPlan />}
        </Animated.View>
    )
}

export default PlanHome
