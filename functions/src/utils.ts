export const firstResponderDiscount = (
    totalLines: number,
    isFirstResponder: boolean
) => {
    switch (true) {
        case isFirstResponder && totalLines === 0:
            return 0
        case isFirstResponder && totalLines === 1:
            return 10
        case isFirstResponder && totalLines >= 2 && totalLines <= 3:
            return 25
        case totalLines >= 4 && isFirstResponder:
            return 20
        default:
            return 0
    }
}

import { getFirestore } from 'firebase-admin/firestore'
import {
    AppUser,
    InternetPlan,
    Line,
    PLUS_BYOD_VALUE,
    Referral,
    ULTIMATE_BYOD_VALUE,
    WELCOME_BYOD_VALUE
} from './typing'
import { EmailRef } from './closeEmailToReferee'

export const byodSavings = (lines: Line[]): number =>
    lines
        .map((line) =>
            line.byod && line.name === 'Unlimited Ultimate'
                ? { discount: ULTIMATE_BYOD_VALUE }
                : line.byod && line.name === 'Unlimited Plus'
                ? { discount: PLUS_BYOD_VALUE }
                : line.byod && line.name === 'Unlimited Welcome'
                ? { discount: WELCOME_BYOD_VALUE }
                : { discount: 0 }
        )
        .reduce((acc, line) => acc + line.discount, 0)

export const totalPerksCount = (lines: Line[], line?: Line) => {
    if (line) {
        return line.perks
            .map((perk) => (perk.selected ? { count: 1 } : { count: 0 }))

            .flat()
            .reduce((acc, perks) => acc + perks.count, 0)
    }

    return lines
        .map((line) =>
            line.perks.map((perk) =>
                perk.selected ? { count: 1 } : { count: 0 }
            )
        )
        .flat()
        .reduce((acc, perks) => acc + perks.count, 0)
}

export const loyaltyBonusDiscount = (
    lines: Line[],
    expressInternet: InternetPlan,
    expressHasFios: boolean
): number => {
    return lines
        .map((line) =>
            (line.name === 'Unlimited Welcome' ||
                line.name === 'Unlimited Plus' ||
                line.name === 'Unlimited Ultimate') &&
            expressInternet !== 'two_gig' &&
            expressInternet !== 'one_gig' &&
            expressHasFios
                ? {
                      discount:
                          lines.length === 1
                              ? 30
                              : lines.length === 2
                              ? 20
                              : lines.length === 3
                              ? 5
                              : 0
                  }
                : (line.name === 'Unlimited Plus' ||
                      line.name === 'Unlimited Ultimate') &&
                  (expressInternet === 'two_gig' ||
                      expressInternet === 'one_gig') &&
                  expressHasFios
                ? {
                      discount:
                          lines.length === 1 ? 25 : lines.length === 2 ? 15 : 0
                  }
                : line.name === 'Unlimited Welcome' &&
                  expressHasFios &&
                  (expressInternet === 'one_gig' ||
                      expressInternet === 'two_gig')
                ? {
                      discount:
                          lines.length === 1
                              ? 30
                              : lines.length === 2
                              ? 20
                              : lines.length === 3
                              ? 5
                              : 0
                  }
                : { discount: 0 }
        )
        .reduce((acc, line) => acc + line.discount, 0)
}

export const sendMe = async (referral: EmailRef) => {
    try {
        if (!referral) return
        const db = getFirestore()
        const docRef = await db.collection('users').doc(referral.userId!).get()
        const user = docRef.data() as AppUser
        const { name, pushToken } = user
        console.log('REFEREE CLIKING', name, pushToken)
        if (!name || !pushToken) return
        const sent = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: pushToken,
                title: `Hey ${name} you just got clicked`,
                body: `${referral.referee?.name} just opened the VVRs site through the link`
            })
        })
        console.log('SENT', sent.ok, pushToken)
    } catch (error) {
        console.log(error)
    }
}

export const handleWirelessFeeAndTemplate = async (
    referral: Referral,
    userId: string
) => {
    try {
        const db = getFirestore()
        const docRef = await db.collection('users').doc(userId).get()
        const user = docRef.data() as AppUser
        console.log(
            'HANDLE WIRELESS FEE AND TEMPLATE',
            referral.package?.wireless,
            referral.referralLines,
            user.name
        )
    } catch (error) {
        console.log('Error handling template', error)
    }
}
