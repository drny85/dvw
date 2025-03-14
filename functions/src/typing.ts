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
    isAutoPay: boolean
    sent?: boolean
    isFirstResponder: boolean
    emPhone?: string
    isWelcome: boolean
}

export type InternetPlan = '300' | '500' | 'one_gig' | 'two_gig' | undefined

export interface MessageUser {
    _id: string | number
    name?: string
    avatar?: string | number
}
export type Quote = {
    quote?: string
    author?: string
}

export type WelcomeEmailProps = {
    customer: {
        name: string
        email: string
        carrier: 'AT&T' | 'T-Mobile' | 'Other'
    }
    myInfo: {
        name: string
        email: string
        phone: string
    }
}

export type IMessage = {
    _id: string | number
    text: string
    createdAt: Date | number
    user: MessageUser
}
export type Msg = Message & IMessage

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
    dislikes: AppUser[]
    liked: boolean
    commentsCount: number
    likesCount: number
    dislikesCount: number
    views: number
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
    originalPrice: number
}
export type SaleData = Pick<
    Feed,
    'saleType' | 'user' | 'numberOfLines' | 'createdAt' | 'id'
>

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
    hasGig: boolean
    customerName: string
    phoneNumber: string
    lines: Line[]
    userId: string
    isAutoPay: boolean
    isFirstResponder: boolean
    scheduledOn: string | null
    sentOn?: string
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

export type AppUser = {
    id: string
    name: string
    email?: string
    emailVerified: boolean
    role?: UserRole
    image?: string
    phone?: string | null
    pushToken?: string
    createdAt?: string
    acceptedEULA: boolean
    blockedUsers: string[]
    coachId: string | null
    isOnline?: boolean
    lastSeen?: string
}
export type NotificationData = {
    id: string
    type: NotificationType
}

export type Referral = {
    id?: string
    name: string
    phone: string
    email?: string
    address: string
    propertyName: string
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
    userName?: string
    updated: string | null
    emailInstroductionSent: boolean
    emailWirelessTemplateSent?: boolean
    isVerizonWirelessCustomer: boolean
    isReferral: boolean
    type: 'move' | 'new' | 'acp' | 'other'
    applicationId: string | null
    mon: string | null
    email_sent: boolean
    email_sent_on: string | null
    comment: ReferralComment[]
    followUpOn: string | null
    referralLines: number
}

export type ReferralComment = {
    message: string
    timestamp: string
}

export interface Helper {
    id?: string
    name: string
    phone: string
    email: string
    addedOn: string
    userId: string
    type: UserRole
}
export interface STATUS {
    id: 'new' | 'in_progress' | 'closed' | 'not_sold'
    name: 'New' | 'In Progress' | 'Closed' | 'Not Sold'
}

export type ReferralSold = {
    id?: string
    customer: string
    seller: string
    date: string
    services: Referral['package']
}

export type NotificationType =
    | 'quote'
    | 'feed'
    | 'quote-reply'
    | 'feed-reply'
    | 'new-message'
    | 'new-signin'
export type UserRole = 'admin' | 'em' | 'coach'
export const BONUS_EXPIRATION_DATE = '12/31/2023'
export const ULTIMATE_BYOD_VALUE = 540 / 36
export const PLUS_BYOD_VALUE = 360 / 36
export const WELCOME_BYOD_VALUE = 180 / 36
