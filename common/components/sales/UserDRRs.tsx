import View from '@/common/components/View'
import Text from '../Text'
import useAppSelector from '@/common/hooks/useAppSelector'
import { usePayout } from '@/common/hooks/referrals/usePayout'
import moment from 'moment'
import { calculateDRR } from '@/utils/calculateDRR'
import { useFilteredClosedReferrals } from '@/common/hooks/referrals/useFilteredClosedReferrals'
import Row from '../Row'
import { SIZES } from '@/constants/Sizes'
import { useEffect, useState } from 'react'

type Props = {
    id: string
    name: string
}

const UserDRRs = ({ id, name }: Props) => {
    const referrals = useAppSelector((s) => s.referrals.referrals)
    const [drr, setDRR] = useState(0)
    const { wtd } = useFilteredClosedReferrals(
        id,
        referrals.filter(
            (r) =>
                r.userId === id &&
                r.status.id === 'closed' &&
                moment(r.order_date).isBetween(
                    moment()
                        .startOf('day')
                        .subtract(1, 'day')
                        .startOf('week')
                        .add(1, 'day'),
                    moment().subtract(1, 'day').endOf('week').add(1, 'day')
                )
        )
    )

    const { internet, tv } = usePayout(wtd)

    useEffect(() => {
        setDRR(
            calculateDRR(
                Object.values(internet).reduce((c, v) => c + v, 0) +
                    Object.values(tv).reduce((c, v) => c + v, 0),
                'wtd'
            )
        )
    }, [internet, tv])

    return (
        <View style={{ marginVertical: SIZES.base }}>
            <Row
                style={{
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingRight: SIZES.base
                }}
            >
                <Text>{name}</Text>

                <Text
                    center
                    fontFamily="SFHeavy"
                    color={
                        drr < 2
                            ? 'error'
                            : drr >= 2 && drr < 3
                            ? 'warning'
                            : 'success'
                    }
                >
                    {drr}
                </Text>
            </Row>
        </View>
    )
}

export default UserDRRs
