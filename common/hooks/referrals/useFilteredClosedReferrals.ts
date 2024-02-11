import moment from 'moment'
import { useEffect, useState } from 'react'

import { useReferrals } from './useReferrals'
import useAppSelector from '../useAppSelector'
import { Referral } from '@/types'

export const useFilteredClosedReferrals = (data?: Referral[]) => {
    const user = useAppSelector((state) => state.auth.user)
    const [loading, setLoading] = useState(true)
    const [today, setToday] = useState<Referral[]>([])
    const [lw, setLastWeek] = useState<Referral[]>([])
    const [lm, setLastMonth] = useState<Referral[]>([])
    const [wtd, setWtd] = useState<Referral[]>([])
    const [mtd, setMtd] = useState<Referral[]>([])
    const { referrals, loading: load } = useReferrals()

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
                moment().startOf('week').subtract(2, 'week').add(1, 'day'),
                moment().startOf('week').subtract(1, 'week')
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
        setLoading(false)
    }, [load, referrals.length, user])

    return { loading, today, wtd, mtd, lw, lm, referrals }
}
