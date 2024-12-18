import { LineName } from '@/types'
import { isDateNotInPast } from '@/utils/isNotInThePast'

export const WELCOME_BYOD_BONUS_ENDS = '2025-01-08'
const WELCOME_BYOD = isDateNotInPast(WELCOME_BYOD_BONUS_ENDS) ? 360 : 180
const PLUS_BYOD = 360
const ULTIMATE_BYOD = 540

export const ULTIMATE_BYOD_VALUE = ULTIMATE_BYOD / 36
export const PLUS_BYOD_VALUE = PLUS_BYOD / 36
export const WELCOME_BYOD_VALUE = WELCOME_BYOD / 36
export const WELCOME_BYOD_BONUS_EXPIRATION = '07/07/2024'
export const WELCOME_OFFER_EXPIRATION_DATE = '2025-03-31'
export const WIRELESS_MONTHLY_GOAL = 10
export const WIRELESS_DIRECT = 125
export const WIRELESS_CLICK_TO_CALL = 60
export const IPHONE_UNLIMITED_PLAN_TRADE_IN_CREDIT = 415
export const IPHONE_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT = 830
export const ANDROID_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT = 800
export const ANDROID_UNLIMITED_PLAN_TRADE_IN_CREDIT = 400
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
    priceWithPlan: { name: LineName; price: number }[]
}
type PhoneArray = {
    [key: string]: Phone[]
}

export const PHONES: PhoneArray = {
    Iphone: [
        {
            name: 'Iphone 16 Pro Max',
            value: 1199.99,
            isFree: false,
            priceWithPlan: [
                { name: 'Unlimited Ultimate', price: 10 },
                { name: 'Unlimited Plus', price: 10 }
            ]
        },
        {
            name: 'Iphone 16 Pro',
            value: 999.99,
            isFree: false,
            priceWithPlan: [
                { name: 'Unlimited Ultimate', price: 5 },
                { name: 'Unlimited Plus', price: 5 }
            ]
        },
        {
            name: 'Iphone 16 Plus',
            value: 929.99,
            isFree: false,
            priceWithPlan: [
                { name: 'Unlimited Ultimate', price: 5 },
                { name: 'Unlimited Plus', price: 5 }
            ]
        },
        {
            name: 'Iphone 16',
            value: 829.99,
            isFree: false,
            priceWithPlan: [
                { name: 'Unlimited Ultimate', price: 0 },
                { name: 'Unlimited Plus', price: 0 }
            ]
        },
        {
            name: 'Iphone 15 Pro Max',
            value: 1199.99,
            isFree: false,
            priceWithPlan: [
                { name: 'Unlimited Ultimate', price: 10 },
                { name: 'Unlimited Plus', price: 10 }
            ]
        },
        {
            name: 'Iphone 15 Pro',
            value: 999.99,
            isFree: false,
            priceWithPlan: [
                { name: 'Unlimited Ultimate', price: 5 },
                { name: 'Unlimited Plus', price: 5 }
            ]
        },
        {
            name: 'Iphone 15 Plus',
            value: 929.99,
            isFree: false,
            priceWithPlan: [
                { name: 'Unlimited Ultimate', price: 5 },
                { name: 'Unlimited Plus', price: 5 }
            ]
        },
        {
            name: 'Iphone 15',
            value: 829.99,
            isFree: false,
            priceWithPlan: [
                { name: 'Unlimited Ultimate', price: 0 },
                { name: 'Unlimited Plus', price: 0 }
            ]
        },
        {
            name: 'Iphone 14 Pro Max',
            value: 1099.99,
            isFree: false,
            priceWithPlan: []
        },
        {
            name: 'Iphone 14 Pro',
            value: 899.99,
            isFree: false,
            priceWithPlan: []
        },
        {
            name: 'Iphone 14 Plus',
            value: 829.99,
            isFree: true,
            priceWithPlan: [
                { name: 'Unlimited Ultimate', price: 0 },
                { name: 'Unlimited Plus', price: 0 },
                { name: 'Unlimited Welcome', price: 0 }
            ]
        },
        {
            name: 'Iphone 14',
            value: 729.99,
            isFree: false,
            priceWithPlan: []
        },
        {
            name: 'Iphone 13 Pro Max',
            value: 1099.99,
            isFree: false,
            priceWithPlan: []
        },
        {
            name: 'Iphone 13 Pro',
            value: 899.99,
            isFree: false,
            priceWithPlan: []
        },
        {
            name: 'Iphone 13 Plus',
            value: 799.99,
            isFree: false,
            priceWithPlan: []
        },
        {
            name: 'Iphone 13',
            value: 629.99,
            isFree: true,
            priceWithPlan: [
                { name: 'Unlimited Ultimate', price: 0 },
                { name: 'Unlimited Plus', price: 0 },
                { name: 'Unlimited Welcome', price: 0 }
            ]
        },
        {
            name: 'Iphone 13 Mini',
            value: 599.99,
            isFree: true,
            priceWithPlan: [
                { name: 'Unlimited Ultimate', price: 0 },
                { name: 'Unlimited Plus', price: 0 },
                { name: 'Unlimited Welcome', price: 0 }
            ]
        }
    ],
    Android: [
        {
            name: 'Samsung Galaxy Z Fold5',
            value: 1799.99,
            priceWithPlan: [],
            isFree: false
        },
        {
            name: 'Samsung Galaxy S24 Ultra',
            value: 1299.99,
            priceWithPlan: [],
            isFree: false
        },
        {
            name: 'Samsung Galaxy S24+',
            value: 999.99,
            priceWithPlan: [],
            isFree: false
        },
        {
            name: 'Samsung Galaxy S24',
            value: 799.99,
            priceWithPlan: [
                { name: 'Unlimited Ultimate', price: 0 },
                { name: 'Unlimited Plus', price: 0 }
            ],
            isFree: false
        },
        {
            name: 'Samsung Galaxy S23 Ultra',
            value: 1199.99,
            priceWithPlan: [],
            isFree: false
        },
        {
            name: 'Samsung Galaxy S23+',
            isFree: false,
            value: 999.99,
            priceWithPlan: []
        },
        {
            name: 'Samsung Galaxy S23',
            isFree: true,
            value: 699.99,
            priceWithPlan: [
                { name: 'Unlimited Ultimate', price: 0 },
                { name: 'Unlimited Plus', price: 0 },
                { name: 'Unlimited Welcome', price: 0 }
            ]
        },
        {
            name: 'Samsung Galaxy S23 FE',
            value: 599.99,
            isFree: true,
            priceWithPlan: [
                { name: 'Unlimited Ultimate', price: 0 },
                { name: 'Unlimited Plus', price: 0 },
                { name: 'Unlimited Welcome', price: 0 }
            ]
        }
    ]
}
