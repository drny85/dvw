import {
    DocumentSnapshot,
    FirestoreEvent,
    onDocumentCreated,
    Change,
    onDocumentWritten
} from 'firebase-functions/v2/firestore'
import { onCall } from 'firebase-functions/v2/https'

// import * as functions from 'firebase-functions'
// import * as moment from 'moment'
import * as dotenv from 'dotenv'
import * as admin from 'firebase-admin'
import fetch from 'node-fetch'
import { Resend } from 'resend'
import SendCloseEmailToReferee from './closeEmailToReferee'
import SendCloseEmail from './closeSaleEmail'
import { WirelessQuoteEmail } from './email'
import IntroductionEmail, { IntroductionEmailProps } from './introductionEmail'
import { quotes } from './quotes'
import { sendNotificationToAllUsers } from './sendNotificationToAllUsers'
import {
    AppUser,
    Feed,
    Helper,
    Msg,
    NotificationData,
    Referral,
    WirelessQuote
} from './typing'
import WirelessClosedTemplate, {
    WirelessClosedTemplateProps
} from './wirelessClosedTemplate'
import { increaseEmailSentForUser } from './utils'

const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY!)

initializeApp()
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const db = getFirestore()

exports.deleleAccount = onCall<{ uid: string }>(async ({ data, auth }) => {
    try {
        const { uid } = data
        const docRef = db.collection('users').doc(uid)
        const feedsRef = await admin
            .firestore()
            .collection('feeds')
            .where('user.id', '==', uid)
            .get()

        await admin.auth().deleteUser(uid)
        await docRef.delete()
        feedsRef.forEach(async (feed: any) => {
            await feed.ref.delete()
            return {
                message: 'Feed deleted'
            }
        })
        return {
            message: 'Account deleted'
        }
    } catch (error) {
        return {
            error
        }
    }
})

exports.sendIntroductionEmail = onCall<{
    referralId: string
}>(async ({ data, auth }): Promise<{ message: string | null }> => {
    if (!auth) return { message: 'Not authorized' }
    if (!data.referralId) return { message: 'No referral id' }
    try {
        const referralRef = await admin
            .firestore()
            .collection('referrals')
            .doc(auth.uid)
            .collection('referrals')
            .doc(data.referralId)
            .get()
        if (!referralRef.exists) return { message: 'no referral found' }

        const referral = referralRef.data() as Referral
        if (referral.email_sent) return { message: 'Email already sent' }
        const userData = await admin
            .firestore()
            .collection('users')
            .doc(auth.uid)
            .get()
        if (!userData.exists) return { message: null }
        const user = userData.data() as AppUser

        const info: IntroductionEmailProps = {
            myName: user.name,
            myEmail: user.email!,
            myNumber: user.phone!,
            propertyName: referral.propertyName,
            customerName: referral.name
        }
        const Template: typeof IntroductionEmail = IntroductionEmail
        await resend.emails.send({
            from: `${user.name} <no-reply@robertdev.net>`,
            to: [referral.email!],
            reply_to: user.email,
            subject: `Your Dedicated Verizon Specialist at ${referral.propertyName}`,
            bcc: [user.email!],
            text: '',
            react: Template(info)
        })
        referralRef.ref.update({
            emailInstroductionSent: true
        })

        await increaseEmailSentForUser(auth.uid)
        referralRef.ref.update({
            comment: admin.firestore.FieldValue.arrayUnion({
                message: 'Introduction email sent',
                timestamp: new Date().toISOString()
            })
        })

        return { message: 'Email sent!' }
    } catch (error) {
        const err = error as Error
        return { message: err.message }
    }
})

exports.sendEmail = onCall<{ quoteId: string }>(
    async ({ data, auth }): Promise<{ message: string }> => {
        try {
            if (!auth) return { message: 'no authorized' }
            const quoteRef = admin
                .firestore()
                .collection('quotes')
                .doc(data.quoteId)
            const res = await quoteRef.get()
            if (!res) return { message: 'no quote' }
            const quote = res.data() as WirelessQuote
            if (quote.sent) return { message: 'quote already sent' }

            if (!quote.email) return { message: 'no email' }
            const userData = await admin
                .firestore()
                .collection('users')
                .doc(auth.uid)
                .get()
            if (!userData.exists) return { message: 'no user' }
            const user = userData.data() as AppUser
            const quoteData: WirelessQuote = {
                ...quote,
                emPhone: user.phone!
            }
            const Template: typeof WirelessQuoteEmail = WirelessQuoteEmail
            await resend.emails.send({
                from: `${user.name} <no-reply@robertdev.net>`,
                to: [quote.email],
                subject: 'Wireless Quote',
                reply_to: user.email,
                bcc: [user.email!],
                text: '',
                react: Template(quoteData)
            })

            await quoteRef.update({
                sent: true,
                sentOn: new Date().toISOString()
            })
            await increaseEmailSentForUser(auth.uid)

            return {
                message: 'Email sent'
            }
        } catch (error) {
            const err = error as Error
            return {
                message: err.message
            }
        }
    }
)

exports.sendNewMessageNotification = onDocumentCreated(
    'messages/{messageId}',
    async (event) => {
        try {
            const messageData = event.data
            const message = messageData?.data() as Msg
            const sender = message.user.name
            const usersRef = await admin.firestore().collection('users').get()
            const users = usersRef.docs.map((doc) => doc.data()) as AppUser[]
            const data: NotificationData = {
                id: message.chatId,
                type: 'new-message'
            }
            const pushTokens: string[] = []
            users.map((user) => {
                if (
                    user.pushToken &&
                    user.id !== message.user._id &&
                    user.emailVerified
                )
                    pushTokens.push(user.pushToken)
            })

            return await sendNotificationToAllUsers(
                'New Message',
                'From ' + sender + ': ' + message.text,

                data,
                pushTokens
            )
        } catch (error) {
            console.log(error)
        }
    }
)

exports.sendNewPostNotification = onDocumentCreated(
    'feeds/{feedId}',
    async (event) => {
        try {
            const quoteData = event.data
            const quote = quoteData?.data() as Feed
            const sender = quote.user
            const usersRef = await admin.firestore().collection('users').get()
            const users = usersRef.docs.map((doc) => doc.data()) as AppUser[]
            const data: NotificationData = {
                id: event.params.feedId,
                type: 'feed'
            }
            const pushTokens: string[] = []
            users.map((user) => {
                if (user.pushToken && user.id !== sender.id)
                    pushTokens.push(user.pushToken)
            })
            const msg =
                quote.feedType === 'feed'
                    ? `New Wireless Sale, ${quote.numberOfLines} lines`
                    : 'A Quote'
            return await sendNotificationToAllUsers(
                'New Post',
                'From ' + sender.name + ': ' + msg,

                data,
                pushTokens
            )
        } catch (error) {
            console.log(error)
        }
    }
)

exports.sendClosedEmail = onDocumentWritten(
    'referrals/{userId}/referrals/{referralId}',
    async (
        event: FirestoreEvent<
            Change<DocumentSnapshot> | undefined,
            { userId: string; referralId: string }
        >
    ) => {
        try {
            if (!event?.data?.after.exists) return
            const d = event?.data.after.data()
            // const before = event.data.before.data() as Referral
            const data = d as Referral

            // if (before !== undefined || before !== null) {
            //     if (
            //         before.status.id === 'closed' &&
            //         data.status.id === 'closed'
            //     ) {
            //         if (
            //             before.package?.wireless === null &&
            //             data.package?.wireless
            //         ) {
            //             //ADD WIRELESS FEE AND SEND TEMPLATE
            //             console.log('ADD TEMPLATE')
            //             handleWirelessFeeAndTemplate(data, data.userId!)
            //         } else {
            //             console.log('NO TEMPLATE')
            //         }
            //         return
            //     }
            // }

            if (data.status.id !== 'closed' || data.email_sent) return

            const userRef = await admin
                .firestore()
                .collection('users')
                .doc(data.userId!)
                .get()

            const user = userRef.data() as AppUser
            const refereeEmail = data.referee?.email
            const ceEmail = data.manager?.email
            const helpersRef = await admin
                .firestore()
                .collection('helpers')
                .doc(data.userId!)
                .collection('helpers')
                .get()
            const coaches = helpersRef.docs.map((s) => s.data())
            const coach = coaches.find((h) => h.type === 'coach')
            const coachEmail = coach?.email || ''

            const Template: typeof SendCloseEmail = SendCloseEmail
            //SEND EMAIL TO LA
            await resend.emails.send({
                from: `${user.name} <no-reply@robertdev.net>`,
                to: [coachEmail],
                subject: 'Sale / Referral Closed',
                reply_to: user.email,
                bcc: data.isReferral ? [ceEmail!, user.email!] : [user.email!],
                text: '',
                react: Template(data)
            })

            // if (!before && data.package?.wireless !== null) {
            //     //   //ADD WIRELESS FEE AND SEND TEMPLATE
            //     console.log('ADD 2ND TEMPLATE')
            //     handleWirelessFeeAndTemplate(data, data.userId!)
            // }

            if (data.isReferral && refereeEmail) {
                let n = Math.floor(Math.random() * Math.floor(quotes.length))
                let author = quotes[n].author
                let quote = quotes[n].quote
                const d = { ...data, author, quote }

                const TemplateTwo: typeof SendCloseEmailToReferee =
                    SendCloseEmailToReferee
                await resend.emails.send({
                    from: `${user.name} <no-reply@robertdev.net>`,
                    to: [refereeEmail],
                    subject: 'Congratulations! This Referral Has Been Closed',
                    reply_to: user.email,
                    bcc: [ceEmail, coachEmail, user.email],
                    text: '',
                    react: TemplateTwo(d)
                })
            }

            admin
                .firestore()
                .collection('referrals')
                .doc(event.params.userId)
                .collection('referrals')
                .doc(event.params.referralId)
                .update({
                    email_sent: true,
                    email_sent_on: new Date().toISOString()
                })

            const sale: ReferralSold = {
                customer: data.name,
                seller: data.userName!,
                date: new Date().toISOString(),
                services: data.package,
                userId: data.userId!,
                coach: coach as Helper
            }
            await admin.firestore().collection('sales').add(sale)
            await increaseEmailSentForUser(event.params.userId)
        } catch (error) {
            const e = error as Error
            console.log(e.message)
        }
    }
)

exports.sendMeATotificationWhenSomeoneLogin = onCall(async (request) => {
    try {
        const token = 'ExponentPushToken[3_OvrIDdTdIAPc0haVxQ1H]'

        if (!request.auth) return
        const docRef = await db.collection('users').doc(request.auth?.uid).get()
        const user = docRef.data() as AppUser
        const { name } = user
        if (!name) return

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: token,
                title: 'New User',
                body: `${name} just signed in`
            })
        })
    } catch (error) {
        console.log(error)
    }
})

exports.sendWirelessClosedTemplate = onCall<{ referralId: string }>(
    async (request): Promise<boolean> => {
        try {
            if (!request.auth) return false
            const referralId = request.data.referralId
            const docRef = await db
                .collection('users')
                .doc(request.auth?.uid)
                .get()

            const referralRef = await db
                .collection('referrals')
                .doc(request.auth.uid)
                .collection('referrals')
                .doc(referralId)
                .get()
            const referral = referralRef.data() as Referral
            const user = docRef.data() as AppUser
            const { name, email, phone } = user

            const Template: typeof WirelessClosedTemplate =
                WirelessClosedTemplate

            const w: WirelessClosedTemplateProps = {
                customerName: referral.name,
                repName: name,
                repPhone: phone || ''
            }
            const result = await resend.emails.send({
                from: `${name} <no-reply@robertdev.net>`,
                to: [referral.email!],
                subject: 'Helpful Information For Your Wireless Service',
                reply_to: user.email,
                bcc: [email!],
                text: '',
                react: Template(w)
            })

            console.log('Wireless Closed Template Sent', result.data?.id)
            await db
                .collection('referrals')
                .doc(request.auth.uid)
                .collection('referrals')
                .doc(referralId)
                .update({
                    emailWirelessTemplateSent: true
                })
            await increaseEmailSentForUser(request.auth.uid)
            return true
        } catch (error) {
            console.log('Error sending wireless template', error)
            return false
        }
    }
)
// //const everyDayAt8Am = '0 8 * * *'
// const everyTwoMinutes = '*/2 * * * *'
// exports.scheduleTask = functions.pubsub
//     .schedule(everyTwoMinutes)
//     .onRun(async () => {
//         try {
//             const wirelessQoutes = await admin
//                 .firestore()
//                 .collection('quotes')
//                 .get()
//             wirelessQoutes.docs.map(async (doc) => {
//                 const quote = doc.data() as WirelessQuote
//                 const today = moment(quote.scheduledOn).isBetween(
//                     moment().startOf('day'),
//                     moment().endOf('day')
//                 )
//                 if (!today) return
//                 return await admin
//                     .firestore()
//                     .collection('followups')
//                     .add({ ...quote })
//             })
//         } catch (error) {
//             console.log(error)
//         }
//     })
type ReferralSold = {
    id?: string
    customer: string
    seller: string
    date: string
    services: Referral['package']
    coach?: Helper
    userId?: string
}
