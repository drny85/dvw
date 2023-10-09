import { onCall } from 'firebase-functions/v2/https'

import * as admin from 'firebase-admin'
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
import { Resend } from 'resend'
import { WirelessQuoteEmail } from './email'
import { WirelessQuote } from './typing'
import * as dotenv from 'dotenv'
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
                text: '',
                react: Template(quoteData)
            })

            await quoteRef.update({
                sent: true,
                sentOn: new Date().toISOString()
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
