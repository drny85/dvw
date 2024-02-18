import moment from 'moment'

export const calculateDRR = (units: number): number => {
    if (units === 0) return 0
    const diff =
        moment().get('day') === 0
            ? 5
            : Math.abs(
                  moment().startOf('week').add(1, 'day').diff(moment(), 'days')
              )

    const days = diff > 5 ? 5 : diff
    const drr = (units / days).toFixed(2)
    return drr === 'NaN' ? 0 : +drr
}
