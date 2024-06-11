import {
    ANDROID_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT,
    ANDROID_UNLIMITED_PLAN_TRADE_IN_CREDIT,
    IPHONE_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT,
    IPHONE_UNLIMITED_PLAN_TRADE_IN_CREDIT
} from '@/constants'
import { Line, LineName, TradeInDeviceType } from '@/types'

export const calculateTradeInValues = (
    lineName: LineName,
    deviceOS: TradeInDeviceType,
    phoneValue: number
): Line['tradeInValues'] | null => {
    if (!lineName || !deviceOS || !phoneValue) return null

    if (lineName === 'Unlimited Welcome') {
        if (deviceOS === 'Iphone') {
            return {
                monthlyPrice:
                    IPHONE_UNLIMITED_PLAN_TRADE_IN_CREDIT >= phoneValue
                        ? 0
                        : (phoneValue - IPHONE_UNLIMITED_PLAN_TRADE_IN_CREDIT) /
                          36,
                name: lineName,
                balance:
                    IPHONE_UNLIMITED_PLAN_TRADE_IN_CREDIT >= phoneValue
                        ? 0
                        : phoneValue - IPHONE_UNLIMITED_PLAN_TRADE_IN_CREDIT,
                discount: IPHONE_UNLIMITED_PLAN_TRADE_IN_CREDIT,
                device: deviceOS,
                phoneRetailValue: phoneValue
            }
        } else {
            return {
                monthlyPrice:
                    ANDROID_UNLIMITED_PLAN_TRADE_IN_CREDIT >= phoneValue
                        ? 0
                        : (phoneValue -
                              ANDROID_UNLIMITED_PLAN_TRADE_IN_CREDIT) /
                          36,
                name: lineName,
                balance:
                    ANDROID_UNLIMITED_PLAN_TRADE_IN_CREDIT >= phoneValue
                        ? 0
                        : phoneValue - ANDROID_UNLIMITED_PLAN_TRADE_IN_CREDIT,
                discount: ANDROID_UNLIMITED_PLAN_TRADE_IN_CREDIT,
                device: deviceOS,
                phoneRetailValue: phoneValue
            }
        }
    } else {
        if (deviceOS === 'Iphone') {
            return {
                monthlyPrice:
                    IPHONE_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT >= phoneValue
                        ? 0
                        : (phoneValue -
                              IPHONE_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT) /
                          36,
                name: lineName,
                balance:
                    phoneValue <= IPHONE_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT
                        ? 0
                        : phoneValue -
                          IPHONE_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT,
                discount: IPHONE_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT,
                device: deviceOS,
                phoneRetailValue: phoneValue
            }
        } else {
            return {
                monthlyPrice:
                    ANDROID_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT >= phoneValue
                        ? 0
                        : (phoneValue -
                              ANDROID_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT) /
                          36,
                name: lineName,
                balance:
                    phoneValue <= ANDROID_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT
                        ? 0
                        : phoneValue -
                          ANDROID_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT,
                discount: ANDROID_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT,
                device: deviceOS,
                phoneRetailValue: phoneValue
            }
        }
    }
}
