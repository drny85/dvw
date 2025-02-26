import { LineName } from '@/types'
import { isDateNotInPast } from '@/utils/isNotInThePast'

export const WELCOME_BYOD_BONUS_ENDS = '2025-04-02'
const WELCOME_BYOD = isDateNotInPast(WELCOME_BYOD_BONUS_ENDS) ? 360 : 180
const PLUS_BYOD = 360
const ULTIMATE_BYOD = 540
export const MOBILE_PLUS_HOME_EXPIRES = '2025-02-25'

export const BIC_CREDIT_MONTHS = 36

export const ULTIMATE_BYOD_VALUE = ULTIMATE_BYOD / 36
export const PLUS_BYOD_VALUE = PLUS_BYOD / 36
export const WELCOME_BYOD_VALUE = WELCOME_BYOD / 36
export const WELCOME_BYOD_BONUS_EXPIRATION = '07/07/2024'
export const WELCOME_OFFER_EXPIRATION_DATE = '2025-03-31'
export const WIRELESS_MONTHLY_GOAL = 10
export const WIRELESS_DIRECT = 125
export const WIRELESS_CLICK_TO_CALL = 60

export const IPHONE_UNLIMITED_WELCOME_TRADE_IN_CREDIT = 414.99
export const IPHONE_UNLIMITED_PLUS_TRADE_IN_CREDIT = 649.99
export const IPHONE_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT = 829.99

export const ANDROID_UNLIMITED_WELCOME_TRADE_IN_CREDIT = 399.99
export const ANDROID_UNLIMITED_PLUS_TRADE_IN_CREDIT = 619.99
export const ANDROID_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT = 799.99

export const SWITCHER_OFFER_EXPIRES = '2024-12-19'

export const VALUES = [
    '799.99',
    '829.99',
    '929.99',
    '999.99',
    '1199.99',
    '1299.99',
    'Other'
]
export const INDEXES = ['Iphone', 'Android']
export type Phone = {
    name: string
    value: number
    isFree: boolean
    tradeInCredit: PriceWithPlan
}
type PhoneArray = {
    [key: string]: Phone[]
}
type PriceWithPlan = {
    [key in LineName]: number
}

export const PHONES: PhoneArray = {
    Iphone: [
        {
            name: 'Iphone 16 Pro Max',
            value: 1199.99,
            isFree: false,
            tradeInCredit: {
                'Unlimited Welcome': IPHONE_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': IPHONE_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': IPHONE_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            }
        },
        {
            name: 'Iphone 16 Pro',
            value: 999.99,
            isFree: false,

            tradeInCredit: {
                'Unlimited Welcome': IPHONE_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': IPHONE_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': IPHONE_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            }
        },
        {
            name: 'Iphone 16 Plus',
            value: 929.99,
            isFree: false,

            tradeInCredit: {
                'Unlimited Welcome': IPHONE_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': IPHONE_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': IPHONE_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            }
        },
        {
            name: 'Iphone 16',
            value: 829.99,
            isFree: false,
            tradeInCredit: {
                'Unlimited Welcome': IPHONE_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': IPHONE_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': 829.99
            }
        },
        {
            name: 'Iphone 15 Pro Max',
            value: 1199.99,
            isFree: false,

            tradeInCredit: {
                'Unlimited Welcome': IPHONE_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': IPHONE_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': IPHONE_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            }
        },
        {
            name: 'Iphone 15 Pro',
            value: 999.99,
            isFree: false,

            tradeInCredit: {
                'Unlimited Welcome': IPHONE_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': IPHONE_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': IPHONE_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            }
        },
        {
            name: 'Iphone 15 Plus',
            value: 929.99,
            isFree: true,

            tradeInCredit: {
                'Unlimited Welcome': IPHONE_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': IPHONE_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': IPHONE_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            }
        },
        {
            name: 'Iphone 15',
            value: 829.99,
            isFree: true,

            tradeInCredit: {
                'Unlimited Welcome': IPHONE_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': IPHONE_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': IPHONE_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            }
        },
        {
            name: 'Iphone 14 Pro Max',
            value: 1099.99,
            isFree: false,
            tradeInCredit: {
                'Unlimited Welcome': IPHONE_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': IPHONE_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': IPHONE_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            }
        },
        {
            name: 'Iphone 14 Pro',
            value: 899.99,
            isFree: false,
            tradeInCredit: {
                'Unlimited Welcome': IPHONE_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': IPHONE_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': IPHONE_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            }
        },
        {
            name: 'Iphone 14 Plus',
            value: 829.99,
            isFree: true,
            tradeInCredit: {
                'Unlimited Welcome': IPHONE_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': IPHONE_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': IPHONE_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            }
        },
        {
            name: 'Iphone 14',
            value: 729.99,
            isFree: true,

            tradeInCredit: {
                'Unlimited Welcome': IPHONE_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': IPHONE_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': IPHONE_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            }
        }
    ],
    Android: [
        {
            name: 'Samsung Galaxy S25 Ultra',
            value: 1299.99,
            tradeInCredit: {
                'Unlimited Welcome': ANDROID_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': 800,
                'Unlimited Ultimate': 1000
            },
            isFree: false
        },
        {
            name: 'Samsung Galaxy S25+',
            value: 999.99,
            tradeInCredit: {
                'Unlimited Welcome': ANDROID_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': ANDROID_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': 999.99
            },
            isFree: false
        },
        {
            name: 'Samsung Galaxy S25',
            value: 799.99,
            tradeInCredit: {
                'Unlimited Welcome': ANDROID_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': 799.99,
                'Unlimited Ultimate': ANDROID_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            },
            isFree: false
        },
        {
            name: 'Samsung Galaxy Z Fold5',
            value: 1799.99,

            tradeInCredit: {
                'Unlimited Welcome': ANDROID_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': ANDROID_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': ANDROID_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            },
            isFree: false
        },
        {
            name: 'Samsung Galaxy S24 Ultra',
            value: 1299.99,

            tradeInCredit: {
                'Unlimited Welcome': ANDROID_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': ANDROID_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': ANDROID_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            },
            isFree: false
        },
        {
            name: 'Samsung Galaxy S24+',
            value: 999.99,
            tradeInCredit: {
                'Unlimited Welcome': ANDROID_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': ANDROID_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': ANDROID_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            },
            isFree: false
        },
        {
            name: 'Samsung Galaxy S24',
            value: 799.99,
            tradeInCredit: {
                'Unlimited Welcome': ANDROID_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': ANDROID_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': 799.99
            },
            isFree: false
        },
        {
            name: 'Samsung Galaxy S24 FE',
            value: 649.99,
            tradeInCredit: {
                'Unlimited Welcome': ANDROID_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': ANDROID_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': ANDROID_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            },
            isFree: true
        },
        {
            name: 'Samsung Galaxy S23 Ultra',
            value: 1199.99,
            tradeInCredit: {
                'Unlimited Welcome': ANDROID_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': ANDROID_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': ANDROID_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            },
            isFree: false
        },
        {
            name: 'Samsung Galaxy S23+',
            isFree: false,
            value: 999.99,

            tradeInCredit: {
                'Unlimited Welcome': ANDROID_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': ANDROID_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': ANDROID_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            }
        },
        {
            name: 'Samsung Galaxy S23',
            isFree: true,
            value: 699.99,
            tradeInCredit: {
                'Unlimited Welcome': ANDROID_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': ANDROID_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': ANDROID_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            }
        },
        {
            name: 'Samsung Galaxy S23 FE',
            value: 599.99,
            isFree: true,
            tradeInCredit: {
                'Unlimited Welcome': ANDROID_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': ANDROID_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': ANDROID_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            }
        },
        {
            name: 'Google Pixel 9 Pro XL',
            value: 1199.99,
            isFree: false,
            tradeInCredit: {
                'Unlimited Welcome': ANDROID_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': ANDROID_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': ANDROID_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            }
        },
        {
            name: 'Google Pixel 9 Pro',
            value: 999.99,
            isFree: false,
            tradeInCredit: {
                'Unlimited Welcome': ANDROID_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': ANDROID_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': ANDROID_UNLIMITED_ULTIMATE_TRADE_IN_CREDIT
            }
        },
        {
            name: 'Google Pixel 9',
            value: 799.99,
            isFree: false,
            tradeInCredit: {
                'Unlimited Welcome': ANDROID_UNLIMITED_WELCOME_TRADE_IN_CREDIT,
                'Unlimited Plus': ANDROID_UNLIMITED_PLUS_TRADE_IN_CREDIT,
                'Unlimited Ultimate': 799.99
            }
        }
    ]
}
