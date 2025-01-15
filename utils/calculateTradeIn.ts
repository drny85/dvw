import { BIC_CREDIT_MONTHS, Phone, PHONES } from '@/constants'
import { Line, LineName, TradeInDeviceType } from '@/types'

export const calculateTradeInValues = (
    lineName: LineName,
    deviceOS: TradeInDeviceType,
    phone: Phone
): Line['tradeInValues'] | null => {
    if (!lineName || !deviceOS || !phone) return null

    const data = PHONES[deviceOS][0]

    const returnData = {
        monthlyPrice: phone.isFree
            ? 0
            : (phone.value - data.tradeInCredit[lineName]) / BIC_CREDIT_MONTHS,
        name: lineName,
        balance: phone.isFree ? 0 : phone.value - data.tradeInCredit[lineName],
        discount: phone.isFree ? 0 : data.tradeInCredit[lineName],
        device: deviceOS,
        isFree: phone.isFree,
        phoneRetailValue: phone.value,
        phone
    }
    return returnData
}
