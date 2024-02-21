import moment from 'moment'
import { useEffect, useState } from 'react'

import { Referral } from '@/types'
import { useReferrals } from './useReferrals'

export const useFilteredClosedReferrals = (
    userId?: string,
    data?: Referral[]
) => {
    const [loading, setLoading] = useState(true)
    const [today, setToday] = useState<Referral[]>([])
    const [lw, setLastWeek] = useState<Referral[]>([])
    const [lm, setLastMonth] = useState<Referral[]>([])
    const [wtd, setWtd] = useState<Referral[]>([])
    const [mtd, setMtd] = useState<Referral[]>([])
    const [twb, setTwb] = useState<Referral[]>([])

    const { referrals, loading: load } = useReferrals(userId!)

    const result: Referral[] = data
        ? data
        : referrals.filter((s) => s.status.id === 'closed')

    useEffect(() => {
        const today = result.filter((r) =>
            moment(r.order_date).isBetween(
                moment().startOf('day'),
                moment().endOf('day')
            )
        )
        setToday(today)

        const newResults = result.filter((r) =>
            moment(r.order_date).isBetween(
                moment()
                    .startOf('day')
                    .subtract(1, 'day')
                    .startOf('week')
                    .add(1, 'day'),
                moment().subtract(1, 'day').endOf('week').add(1, 'day')
            )
        )

        const thisMonth = result.filter((r) => {
            return moment(r.order_date).isBetween(
                moment().startOf('month'),
                moment().endOf('day')
            )
        })
        const lastWeek = result.filter((r) => {
            return moment(r.order_date).isBetween(
                moment().startOf('week').subtract(1, 'week').add(1, 'day'),
                moment().startOf('week').add(1, 'day')
            )
        })

        const twbData = result.filter((r) => {
            return moment(r.order_date).isBetween(
                moment().startOf('week').subtract(2, 'week').add(1, 'day'),
                moment().startOf('week').subtract(1, 'week').add(1, 'day')
            )
        })

        const lastMonth = result.filter((r) => {
            return moment(r.order_date).isBetween(
                moment().startOf('month').subtract(1, 'month'),
                moment().subtract(1, 'month').endOf('month')
            )
        })

        setWtd(newResults)
        setLastMonth(lastMonth)
        setLastWeek(lastWeek)
        setMtd(thisMonth)
        setTwb(twbData)
        setLoading(false)
    }, [load, referrals.length])

    return { loading, today, wtd, mtd, lw, lm, twb, referrals }
}
