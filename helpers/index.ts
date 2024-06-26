import {
    PLUS_BYOD_VALUE,
    ULTIMATE_BYOD_VALUE,
    WELCOME_BYOD_VALUE
} from '@/constants'
import { setLinesData } from '@/features/wireless/wirelessSlide'
import { InternetPlan, Line, LineName } from '@/types'
import { calculateTradeInValues } from '@/utils/calculateTradeIn'
import { Dispatch } from '@reduxjs/toolkit'

export const mobilePlusHome = (
    line: Line,
    expressInternet: InternetPlan,
    expressHasFios: boolean
): number => {
    // if (
    //     (expressInternet === 'one_gig' || expressInternet === 'two_gig') &&
    //     (line.name === 'Unlimited Plus' || line.name === 'Unlimited Ultimate')
    // ) {
    //     return 10
    // } else if (
    //     expressHasFios &&
    //     expressInternet === 'one_gig' &&
    //     line.name === 'Unlimited Welcome'
    // ) {
    //     return 5
    // } else if (expressHasFios && expressInternet !== 'one_gig') {
    //     return 5
    // } else {
    //     return 0
    // }
    if (expressHasFios) {
        if (line.name === 'Unlimited Welcome') {
            return 5
        } else {
            return 10
        }
    } else {
        return 0
    }
}
export const calculatePrice = (
    line: Line,
    lines: Line[],
    expressAutoPay: 0 | 10,
    expressInternet: InternetPlan,
    expressHasFios: boolean
): number => {
    switch (line.name) {
        case 'Unlimited Welcome':
            return (
                (lines.length === 1
                    ? 75
                    : lines.length === 2
                    ? 65
                    : lines.length === 3
                    ? 50
                    : lines.length === 4
                    ? 40
                    : lines.length >= 5
                    ? 37
                    : 0) -
                expressAutoPay -
                mobilePlusHome(line, expressInternet, expressHasFios) -
                (line.byod ? WELCOME_BYOD_VALUE : 0)
                // calculateLoyaltyBonus(line, expressInternet) +
                // perksTotal(line)
            )
        case 'Unlimited Plus':
            return (
                (lines.length === 1
                    ? 90
                    : lines.length === 2
                    ? 80
                    : lines.length === 3
                    ? 65
                    : lines.length === 4
                    ? 55
                    : lines.length >= 5
                    ? 52
                    : 0) -
                expressAutoPay -
                mobilePlusHome(line, expressInternet, expressHasFios) -
                (line.byod ? PLUS_BYOD_VALUE : 0)
                // calculateLoyaltyBonus(line, expressInternet) +
                // perksTotal(line)
            )
        case 'Unlimited Ultimate':
            return (
                (lines.length === 1
                    ? 100
                    : lines.length === 2
                    ? 90
                    : lines.length === 3
                    ? 75
                    : lines.length === 4
                    ? 65
                    : lines.length >= 5
                    ? 62
                    : 0) -
                expressAutoPay -
                mobilePlusHome(line, expressInternet, expressHasFios) -
                (line.byod ? ULTIMATE_BYOD_VALUE : 0)
                // calculateLoyaltyBonus(line, expressInternet) +
                // perksTotal(line)
            )
        default:
            return 0
    }
}

export const onSwitchLine = (
    id: string,
    lines: Line[],
    name: LineName,
    expressAutoPay: 0 | 10,
    expressInternet: InternetPlan,
    expressHasFios: boolean,
    dispatch: Dispatch<any>
) => {
    const line = lines.find((line) => line.id === id)!
    const n: Line = {
        ...line,
        originalPrice:
            name === 'Unlimited Ultimate'
                ? 100
                : name === 'Unlimited Plus'
                ? 90
                : name === 'Unlimited Welcome'
                ? 75
                : 0,
        name: name
    }
    const perkChecked =
        name === 'Unlimited Ultimate'
            ? {
                  ...n,

                  perks: []
              }
            : { ...n, perks: [] }
    const newLines = lines.map((line) => {
        if (line.id === id) {
            return {
                ...perkChecked,
                price: calculatePrice(
                    line,
                    lines,
                    expressAutoPay,
                    expressInternet,
                    expressHasFios
                ),
                name: name,
                perks: line.perks,
                tradeIn: line.tradeIn,
                tradeInValues: line.tradeInValues
                    ? calculateTradeInValues(
                          name,
                          line.tradeInValues?.device!,
                          line.tradeInValues.phone
                      )
                    : null
            }
        }
        return line
    })

    dispatch(setLinesData(newLines))
}

export const calculateLoyaltyBonus = (
    line: Line,
    lines: Line[],
    internet: InternetPlan,
    expressHasFios: boolean
): number => {
    if (!expressHasFios || lines.length === 0) return 0
    const gig = internet === 'one_gig' || internet === 'two_gig'
    if (line.name === 'Unlimited Plus' || line.name === 'Unlimited Ultimate') {
        if (gig) {
            return lines.length === 1 ? 25 : lines.length === 2 ? 15 : 0
        }
        return lines.length === 1
            ? 30
            : lines.length === 2
            ? 20
            : lines.length === 3
            ? 5
            : 0
    } else if (line.name === 'Unlimited Welcome') {
        return lines.length === 1
            ? 30
            : lines.length === 2
            ? 20
            : lines.length === 3
            ? 5
            : 0
    } else {
        return 0
    }
}

export const perksTotal = (line: Line): number => {
    return line.perks
        .map((i) => (i.selected ? i.price : 0))
        .reduce(
            (acc, p) => acc + p,

            0
        )
}
