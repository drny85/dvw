import { Referral, TIERS } from '@/types'
import { useMemo, useState } from 'react'

type Payout = Record<string, number>
export const usePayout = (referrals: Referral[]) => {
    const calculatePayout = () => {
        const internet: Payout = {}
        const tv: Payout = {}
        const home: Payout = {}
        const wireless: Payout = {}
        let internetAmount = 0
        let tvAmount = 0
        let homeAmount = 0
        let wirelessAmount = 0

        const internetIncrease = (id: Referral['package']) => {
            switch (true) {
                case referrals.length <= TIERS.tier.tier1:
                    return 0
                case referrals.length >= TIERS.tier.tier2 &&
                    referrals.length < TIERS.tier.tier3 &&
                    (id?.internet?.id === 'internet_500' ||
                        id?.internet?.id === 'internet_300'):
                    return 20
                case referrals.length >= TIERS.tier.tier3 &&
                    id?.internet?.id === 'internet_300':
                    return 30
                case referrals.length >= TIERS.tier.tier3 &&
                    id?.internet?.id === 'internet_500':
                    return 35
                case referrals.length >= TIERS.tier.tier2 &&
                    referrals.length < TIERS.tier.tier3 &&
                    (id?.internet?.id === 'one_gig' ||
                        id?.internet?.id === 'two_gig'):
                    return 25

                case referrals.length >= TIERS.tier.tier3 &&
                    (id?.internet?.id === 'one_gig' ||
                        id?.internet?.id === 'two_gig'):
                    return 45

                default:
                    return 0
            }
        }

        const increaseWireless = (
            id: 'wireless_referral' | 'wireless_direct'
        ) => {
            switch (true) {
                case referrals.length > 0:
                    return TIERS.wireless[id]
                default:
                    return 0
            }
        }

        referrals.forEach((r, i) => {
            if (r.package === null) return

            if (r.package.internet !== null) {
                Object.entries(TIERS.internet).forEach((obj) => {
                    if (r.package?.internet?.id === obj[0]) {
                        internetAmount +=
                            TIERS.internet[obj[0]] + internetIncrease(r.package)
                    }
                })
            }

            if (r.package.internet !== null) {
                if (internet[r.package.internet.id] === undefined) {
                    internet[r.package.internet.id] = 1
                } else {
                    internet[r.package.internet.id] += 1
                }
            }
            if (r.package.tv !== null) {
                if (tv[r.package.tv.id] === undefined) {
                    tv[r.package.tv.id] = 1
                } else {
                    tv[r.package.tv.id] += 1
                }
            }
            if (r.package.home !== null) {
                if (home[r.package.home.id] === undefined) {
                    home[r.package.home.id] = 1
                } else {
                    home[r.package.home.id] += 1
                }
            }

            if (r.package.wireless !== null) {
                if (wireless[r.package.wireless.id] === undefined) {
                    wireless[r.package.wireless.id] = 1
                } else {
                    wireless[r.package.wireless.id] += 1
                }
            }

            return {
                tvAmount,
                internet,
                tv,
                home,
                wireless,
                wirelessAmount,
                homeAmount,
                internetAmount
            }
        })

        Object.entries(tv).forEach((obj) => {
            const tier =
                referrals.length <= TIERS.tier.tier1
                    ? 'tier1'
                    : referrals.length >= TIERS.tier.tier2 &&
                      referrals.length < TIERS.tier.tier3
                    ? 'tier2'
                    : 'tier3'
            //@ts-ignore
            tvAmount += TIERS.tv[obj[0]][tier] * obj[1]
        })

        Object.values(home).forEach((obj) => {
            homeAmount += obj * TIERS.home['home_phone']
        })

        Object.entries(wireless).forEach((obj) => {
            const result = obj as any
            const data = result[0] as 'wireless_referral' | 'wireless_direct'
            wirelessAmount += increaseWireless(data) * obj[1]
        })

        return {
            tvAmount,
            internet,
            tv,
            home,
            wireless,
            wirelessAmount,
            homeAmount,
            internetAmount
        }
    }

    return useMemo(() => calculatePayout(), [referrals])
}
