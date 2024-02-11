import { Referral, ReferralsFilterType } from '@/types'
import moment from 'moment'

export const getResults = (
    referrals: Referral[],
    type: ReferralsFilterType
): Referral[] => {
    switch (type) {
        case 'all':
            return referrals
        case 'in-progress':
            return referrals.filter(
                (referral) => referral.status.id === 'in_progress'
            )
        case 'new':
            return referrals.filter((referral) => referral.status.id === 'new')
        case 'closed-today':
            return referrals.filter(
                (referral) =>
                    referral.status.id === 'closed' &&
                    moment(referral.order_date).isBetween(
                        moment().startOf('day'),
                        moment().endOf('day')
                    )
            )
        case 'closed-mtd':
            return referrals.filter(
                (r) =>
                    r.status.id === 'closed' &&
                    moment(r.order_date).isBetween(
                        moment().startOf('month'),
                        moment().endOf('month')
                    )
            )
        case 'closed-wtd':
            const isSunday = moment().get('day') === 0
            if (isSunday) {
                return referrals.filter(
                    (r) =>
                        r.status.id === 'closed' &&
                        moment(r.order_date).isBetween(
                            moment()
                                .startOf('week')
                                .subtract(1, 'week')
                                .add(1, 'day'),
                            moment()
                        )
                )
            }
            return referrals.filter(
                (r) =>
                    r.status.id === 'closed' &&
                    moment(r.order_date).isBetween(
                        moment().startOf('week').add(1, 'day'),
                        moment().endOf('week').add(1, 'day')
                    )
            )

        case 'moving-today':
            return referrals.filter(
                (r) =>
                    r.status.id !== 'closed' &&
                    r.status.id !== 'not_sold' &&
                    moment(r.moveIn).isBetween(
                        moment().startOf('day'),
                        moment().endOf('day')
                    )
            )

        case 'moving-in-one-week':
            return referrals.filter(
                (r) =>
                    r.status.id !== 'closed' &&
                    r.status.id !== 'not_sold' &&
                    moment(r.moveIn).isBetween(
                        moment().startOf('day'),
                        moment().endOf('day').add(7, 'days')
                    )
            )
        case 'moving-in-one-month':
            return referrals.filter(
                (r) =>
                    r.status.id !== 'closed' &&
                    r.status.id !== 'not_sold' &&
                    moment(r.moveIn).isBetween(
                        moment().startOf('day'),
                        moment().endOf('day').add(1, 'month')
                    )
            )

        case 'installation-today':
            return referrals.filter(
                (r) =>
                    r.status.id === 'closed' &&
                    moment(r.due_date).isBetween(
                        moment().startOf('day'),
                        moment().endOf('day')
                    )
            )
        case 'installation-last-week':
            return referrals.filter(
                (r) =>
                    r.status.id === 'closed' &&
                    moment(r.due_date).isBetween(
                        moment()
                            .startOf('week')
                            .add(1, 'day')
                            .subtract(1, 'week'),
                        moment().endOf('week').add(1, 'day').subtract(1, 'week')
                    )
            )

        case 'installation-yesterday':
            return referrals.filter(
                (r) =>
                    r.status.id === 'closed' &&
                    moment(r.due_date).isBetween(
                        moment().startOf('day').subtract(1, 'day'),

                        moment().endOf('day').subtract(1, 'day')
                    )
            )
        default:
            return []
    }
}
