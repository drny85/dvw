import My5GPlan from '@/common/components/myPlan/My5GPlan'
import MyPlan from '@/common/components/myPlan/MyPlan'
import Screen from '@/common/components/Screen'
import useAppSelector from '@/common/hooks/useAppSelector'

const PlanHome = () => {
    const show5G = useAppSelector((s) => s.settings.show5G)
    console.log(show5G)
    return <>{show5G ? <My5GPlan /> : <MyPlan />}</>
}

export default PlanHome
