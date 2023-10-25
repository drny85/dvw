import { AppUser, UserRole } from './features/auth/authSlice'

export type Feed = {
    id?: string
    title: string
    message: string
    image: string
    numberOfLines: number
    createdAt: string
    updatedAt?: string
    user: AppUser
    comments: Comment[]
    likes: string[]
    liked: boolean
    commentsCount: number
    likesCount: number

    feedType: FeedType
    saleType: SaleType | null
}

export type Comment = {
    id: string
    content: string
    createdAt: string
    updatedAt?: string
    user: AppUser
    likes: string[]
    liked?: boolean
    replies?: Comment[]
}
export type SaleType = 'direct' | 'c2c'
export type SalesRange = 'today' | 'wtd' | 'mtd' | 'ytd' | 'all'

export interface Line {
    id: string
    name: LineName
    price: number
    byod: boolean
    perks: Perk[]
}
export type SaleData = Pick<
    Feed,
    'saleType' | 'user' | 'numberOfLines' | 'createdAt' | 'id'
>

export type InternetPlan =
    | '300'
    | '500'
    | 'one_gig'
    | 'two_gig'
    | undefined
    | null
export interface Perk {
    name: PerkName
    price: number
    image: string
    description: string
    sharabled: boolean
    value: number
    selected: boolean
}

export type LineName =
    | 'Unlimited Plus'
    | 'Unlimited Welcome'
    | 'Unlimited Ultimate'

export type PerkName =
    | 'disney bundle'
    | 'apple one'
    | 'apple music family'
    | '2 TB cloud storage'
    | '+play monthly credit'
    | 'walmart+ membership'
    | '100 GB mobile hotspot'
    | '3 TravelPass Days'
    | 'smartwatch data & safety'

export interface WirelessQuote {
    id: string
    quoteId?: string
    email: string
    message: string
    createdAt: string
    status: 'pending' | 'closed' | 'rejected'
    hasFios: boolean
    internetPlan: InternetPlan
    customerName: string
    phoneNumber: string
    lines: Line[]
    userId: string
    sent?: boolean
    isAutoPay: boolean
    sentOn?: string
    isFirstResponder: boolean
    scheduledOn: string | null
    emPhone?: string
}

export type FeedType = 'quote' | 'feed'

export type Chat = {
    id?: string
    name: string
    user: AppUser
    private: boolean
    createdAt: string
}
export type ContactNumber = {
    name: string
    number: string
}

export type Message = {
    id?: string
    body: string
    createdAt: string
    reply: Message | null
    chatId: string
    isReply: boolean
    sender: AppUser
    type: 'text' | 'image'
    storagePath: string | null
}

export type NotificationType =
    | 'quote'
    | 'feed'
    | 'quote-reply'
    | 'feed-reply'
    | 'new-message'
    | 'reminder'

export type NotificationData = {
    id: string
    type: NotificationType
}

export type ORDER_TYPE = 'move' | 'new' | 'acp' | 'other'

export type Referral = {
    id?: string
    name: string
    phone: string
    email?: string
    address: string
    apt?: string | null
    package: {
        home: { id: string; name: string } | null
        internet: {
            id: 'internet_300' | 'internet_500' | 'one_gig' | 'two_gig'
            name: '300 Mbps' | '500 Mbps' | '1 Gigabit' | '2 Gigabit'
        } | null
        tv: {
            id:
                | 'tv_test_drive'
                | 'tv_your'
                | 'tv_more'
                | 'tv_most'
                | 'tv_mundo'
                | 'tv_total'
                | 'youtube'
            name: string
        } | null
        wireless: {
            id: 'wireless_referral' | 'wireless_direct'
            name: string
        } | null
    } | null
    order_date: string | null
    due_date: string | null
    referee: Helper | null
    manager: Helper | null
    status: STATUS
    date_entered: string
    userId: string | null
    moveIn: string | null
    addedBy: string
    updated: string | null
    isVerizonWirelessCustomer: boolean
    isReferral: boolean
    type: 'move' | 'new' | 'acp' | 'other'
    applicationId: string | null
    mon: string | null
    email_sent: boolean
    email_sent_on: string | null
    comment: string | null
    followUpOn: string | null
}

export interface STATUS {
    id: 'new' | 'in_progress' | 'closed' | 'not_sold'
    name: 'New' | 'In Progress' | 'Closed' | 'Not Sold'
}
export const statuses: STATUS[] = [
    { id: 'new', name: 'New' },
    { id: 'in_progress', name: 'In Progress' },
    { id: 'closed', name: 'Closed' },
    { id: 'not_sold', name: 'Not Sold' }
]

export interface Helper {
    id?: string
    name: string
    phone: string
    email: string
    addedOn: string
    userId: string
    type: UserRole
}

export interface SERVICE {
    id: string | any
    name: string | any
}
export const services = [
    {
        internet: [
            { id: 'internet_300', name: '300 Mbps' },
            { id: 'internet_500', name: '500 Mbps' },
            { id: 'one-gig', name: '1 Gigabit' },
            { id: 'two-gig', name: '2 Gigabit' }
        ]
    },
    {
        tv: [
            { id: 'tv_test_drive', name: 'Test Drive' },
            { id: 'tv_your', name: 'Your Fios TV' },
            { id: 'tv_more', name: 'More Fios TV' },
            { id: 'tv_most', name: 'Most Fios TV' },
            { id: 'tv_mundo', name: 'TV Mundo' },
            { id: 'tv_total', name: 'Mundo Total' },
            { id: 'youtube', name: 'YouTube TV' }
        ]
    },
    {
        phone: [
            {
                id: 'home_phone',
                name: 'Home Phone'
            }
        ]
    },
    {
        wireless: [
            { id: 'wireless_referral', name: 'Click To Call' },
            { id: 'wireless_direct', name: 'Direct Sale' }
        ]
    }
]

export const TVnames: { [key: string]: string } = {
    tv_test_drive: 'Test Drive',
    tv_your: 'Your TV',
    tv_more: 'More TV',
    tv_most: 'Most TV',
    tv_mundo: 'TV Mundo',
    tv_total: 'Mundo Total',
    youtube: 'YouTube'
}

export const INTERNETnames: { [key: string]: string } = {
    internet_300: '300 Mbps',
    internet_500: '500 Mbps',
    one_gig: '1 Gigabit',
    two_gig: '2 Gigabit'
}

export const WIRELESSnames: { [key: string]: string } = {
    wireless_referral: 'Wireless CTC',
    wireless_direct: 'Wireless DS'
}
export const TIERS = {
    internet: {
        internet_300: 20,
        internet_500: 35,
        one_gig: 55,
        two_gig: 75
    },
    tv: {
        tv_your: { tier1: 15, tier2: 25, tier3: 30 },
        tv_test_drive: { tier1: 20, tier2: 30, tier3: 40 },
        tv_more: { tier1: 15, tier2: 25, tier3: 30 },
        tv_most: { tier1: 30, tier2: 40, tier3: 50 },
        tv_mundo: { tier1: 10, tier2: 20, tier3: 25 },
        tv_total: { tier1: 10, tier2: 20, tier3: 25 },
        youtube: { tier1: 15, tier2: 15, tier3: 15 }
    },
    home: {
        home_phone: 10
    },

    tier: {
        tier1: 8,
        tier2: 9,
        tier3: 15
    },
    wireless: {
        wireless_referral: 60,
        wireless_direct: 125
    }
}

export type ReferralsFilterType =
    | 'all'
    | 'in-progress'
    | 'new'
    | 'closed-today'
    | 'closed-wtd'
    | 'closed-mtd'
    | 'moving-today'
    | 'moving-in-one-week'
    | 'moving-in-one-month'
    | 'installation-today'
    | 'installation-yesterday'
    | 'installation-last-week'

export const data = [{ id: '0' }, { id: '1' }, { id: '2' }, { id: '3' }]
