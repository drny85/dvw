import { LineName } from '@/types'

export const ULTIMATE_BYOD_VALUE = 540 / 36
export const PLUS_BYOD_VALUE = 360 / 36
export const WELCOME_BYOD_VALUE = 360 / 36
export const LOYALTY_EXPIRATION_DATE = '05/08/2024'
export const WELCOME_OFFER_EXPIRATION_DATE = '06/30/2024'
export const WIRELESS_MONTHLY_GOAL = 10
export const WIRELESS_DIRECT = 125
export const WIRELESS_CLICK_TO_CALL = 60
export const IPHONE_UNLIMITED_PLAN_TRADE_IN_CREDIT = 415
export const IPHONE_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT = 830
export const ANDROID_NON_UNLIMITED_PLAN_TRADE_IN_CREDIT = 800
export const ANDROID_UNLIMITED_PLAN_TRADE_IN_CREDIT = 400

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
