import moment from 'moment'

export function isDateNotInPast(date: string) {
    return moment(date).isSameOrAfter(moment(), 'day')
}
