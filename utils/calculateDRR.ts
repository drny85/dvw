import { SalesRange } from '@/types'
import moment from 'moment'
import { daysSinceMonthStarted } from './daysSince'

export const calculateDRR = (units: number, range: SalesRange): number => {
    if (units === 0) return 0
    const diff = moment().get('day')

    const mtdDays = daysSinceMonthStarted()

    // const days =  (diff > 5 || diff) === 0 ? 5 : diff
    const days =
        range === 'lw' || range === 'twb'
            ? 5
            : range === 'wtd' && (diff > 5 || diff === 0)
            ? 5
            : range === 'lm'
            ? 20
            : range === 'mtd'
            ? mtdDays
            : diff
    const drr = (units / days).toFixed(2)
    return drr === 'NaN' ? 0 : +drr
}
