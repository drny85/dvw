import { createCollection } from '@/firebase'
import {
    AppUser,
    Chat,
    Comment,
    Feed,
    Helper,
    Msg,
    Referral,
    ReferralSold,
    WirelessQuote
} from '@/types'

export const feedsColletion = createCollection<Feed>('feeds')
export const chatsColletion = createCollection<Chat>('chats')
export const messagesCollection = createCollection<Msg>('messages')
export const wirelessQuotesCollection =
    createCollection<WirelessQuote>('quotes')
export const followUpsCollection = createCollection<WirelessQuote>('followups')
export const salesCollection = createCollection<ReferralSold>('sales')

export const helpersCollection = (userId: string) =>
    createCollection<Helper>(`helpers/${userId}/helpers`)

export const referralssCollection = (userId: string) =>
    createCollection<Referral>(`referrals/${userId}/referrals`)

export const usersCollection = createCollection<AppUser>('users')
export const chatsCollection = createCollection<Chat>('chats')
export const propertiesCollection = (userId: string) =>
    createCollection<{ name: string }>(`/properties/${userId}/properties`)
export const commentsCollection = (feedId: string) =>
    createCollection<Comment>(`comments/${feedId}/comments`)
