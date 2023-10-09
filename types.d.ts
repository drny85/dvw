import { AppUser } from './features/auth/authSlice'

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
}
export type SaleData = Pick<
    Feed,
    'saleType' | 'user' | 'numberOfLines' | 'createdAt' | 'id'
>

export type InternetPlan = '200' | '400' | 'gig' | '2gig' | undefined | null
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
    isAutoPay: boolean
    isFirstResponder: boolean
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
