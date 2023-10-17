import { onCall } from 'firebase-functions/v2/https'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'

// import * as functions from 'firebase-functions'
// import * as moment from 'moment'
import * as admin from 'firebase-admin'
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
import { Resend } from 'resend'
import { WirelessQuoteEmail } from './email'
import { Message, NotificationData, WirelessQuote } from './typing'
import * as dotenv from 'dotenv'
import { sendNotificationToAllUsers } from './sendNotificationToAllUsers'
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
            const user = userData.data()!
            const quoteData: WirelessQuote = {
                ...quote,
                emPhone: user.phone || null
            }
            const Template: typeof WirelessQuoteEmail = WirelessQuoteEmail
            await resend.emails.send({
                from: `${user.name} <melendez@robertdev.net>`,
                to: [quote.email],
                subject: 'Wireless Quote',
                reply_to: user.email,
                cc: [user.email],
                text: '',
                react: Template(quoteData)
            })

            await quoteRef.update({
                sent: true,
                sentOn: new Date().toISOString()
            })

            await admin
                .firestore()
                .collection('users')
                .doc(auth.uid)
                .collection('emails')
                .add({
                    sentOn: new Date().toISOString(),
                    sentTo: quote.email,
                    subject: 'Wireless Quote',
                    quoteId: quote.id
                })

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
            const message = messageData?.data() as Message
            const sender = message.sender.name
            const usersRef = await admin.firestore().collection('users').get()
            const users = usersRef.docs.map((doc) => doc.data())
            const data: NotificationData = {
                id: message.chatId,
                type: 'new-message'
            }
            const pushTokens: string[] = []
            users.map((user) => {
                if (user.pushToken && user.id !== message.sender.id)
                    pushTokens.push(user.pushToken)
            })

            return await sendNotificationToAllUsers(
                'New Message',
                'From ' + sender + ': ' + message.body,

                data,
                pushTokens
            )
        } catch (error) {
            console.log(error)
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
