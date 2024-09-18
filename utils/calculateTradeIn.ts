import {
    ANDROID_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT,
    ANDROID_UNLIMITED_PLAN_TRADE_IN_CREDIT,
    IPHONE_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT,
    IPHONE_UNLIMITED_PLAN_TRADE_IN_CREDIT,
    Phone
} from '@/constants'
import { Line, LineName, TradeInDeviceType } from '@/types'
const TRADE_IN = 999.99
export const calculateTradeInValues = (
    lineName: LineName,
    deviceOS: TradeInDeviceType,
    phone: Phone
): Line['tradeInValues'] | null => {
    if (!lineName || !deviceOS || !phone) return null

    if (lineName === 'Unlimited Welcome') {
        if (deviceOS === 'Iphone') {
            return {
                monthlyPrice: phone.isFree
                    ? 0
                    : IPHONE_UNLIMITED_PLAN_TRADE_IN_CREDIT >= phone.value
                    ? 0
                    : (phone.value - IPHONE_UNLIMITED_PLAN_TRADE_IN_CREDIT) /
                      36,
                name: lineName,
                balance: phone.isFree
                    ? 0
                    : IPHONE_UNLIMITED_PLAN_TRADE_IN_CREDIT >= phone.value
                    ? 0
                    : phone.value - IPHONE_UNLIMITED_PLAN_TRADE_IN_CREDIT,
                discount: phone.isFree
                    ? phone.value
                    : IPHONE_UNLIMITED_PLAN_TRADE_IN_CREDIT,
                device: deviceOS,
                phoneRetailValue: phone.value,
                phone
            }
        } else {
            return {
                monthlyPrice: phone.isFree
                    ? 0
                    : ANDROID_UNLIMITED_PLAN_TRADE_IN_CREDIT >= phone.value
                    ? 0
                    : (phone.value - ANDROID_UNLIMITED_PLAN_TRADE_IN_CREDIT) /
                      36,
                name: lineName,
                balance: phone.isFree
                    ? 0
                    : ANDROID_UNLIMITED_PLAN_TRADE_IN_CREDIT >= phone.value
                    ? 0
                    : phone.value - ANDROID_UNLIMITED_PLAN_TRADE_IN_CREDIT,
                discount: phone.isFree
                    ? phone.value
                    : ANDROID_UNLIMITED_PLAN_TRADE_IN_CREDIT,
                device: deviceOS,
                phoneRetailValue: phone.value,
                phone
            }
        }
    } else {
        if (deviceOS === 'Iphone') {
            return {
                monthlyPrice:
                    phone.name.includes('16 Plus') &&
                    lineName === 'Unlimited Ultimate'
                        ? (phone.value - 929.99) / 36
                        : phone.name.includes('16 Pro') &&
                          lineName === 'Unlimited Ultimate'
                        ? (phone.value - TRADE_IN) / 36
                        : phone.isFree
                        ? 0
                        : IPHONE_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT >=
                          phone.value
                        ? 0
                        : (phone.value -
                              IPHONE_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT) /
                          36,
                name: lineName,
                balance:
                    phone.name.includes('16 Plus') &&
                    lineName === 'Unlimited Ultimate'
                        ? 0
                        : phone.name.includes('16 Pro') &&
                          lineName === 'Unlimited Ultimate'
                        ? phone.value - TRADE_IN
                        : phone.isFree
                        ? 0
                        : phone.value <=
                          IPHONE_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT
                        ? 0
                        : phone.value -
                          IPHONE_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT,
                discount:
                    phone.name.includes('16 Pro') &&
                    lineName === 'Unlimited Ultimate'
                        ? TRADE_IN
                        : phone.isFree
                        ? phone.value
                        : IPHONE_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT,
                device: deviceOS,
                phoneRetailValue: phone.value,
                phone
            }
        } else {
            return {
                monthlyPrice: phone.isFree
                    ? 0
                    : ANDROID_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT >= phone.value
                    ? 0
                    : (phone.value -
                          ANDROID_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT) /
                      36,
                name: lineName,
                balance: phone.isFree
                    ? 0
                    : phone.value <= ANDROID_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT
                    ? 0
                    : phone.value - ANDROID_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT,
                discount: phone.isFree
                    ? phone.value
                    : ANDROID_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT,
                device: deviceOS,
                phoneRetailValue: phone.value,
                phone
            }
        }
    }
}
