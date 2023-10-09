import { onCall } from 'firebase-functions/v2/https'

import * as admin from 'firebase-admin'
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
import { Resend } from 'resend'
import { WirelessQuoteEmail } from './email'
import { WirelessQuote } from './typing'

const resend = new Resend('re_PR6C2YML_X9KEahBcZKuZbBLZz8DNYar3')

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

exports.sendEmail = onCall<{ quote: WirelessQuote }>(
    async ({ data, auth }): Promise<{ message: string }> => {
        try {
            // const { from, subject, message, to } = data
            // const response = await admin.auth().getUserByEmail(from)
            // const user = response.toJSON()

            if (!auth) return { message: 'no authorized' }
            if (!data.quote.email) return { message: 'no email' }
            const userData = await admin
                .firestore()
                .collection('users')
                .doc(auth.uid)
                .get()
            if (!userData.exists) return { message: 'no user' }
            const user = userData.data()!
            const Template: typeof WirelessQuoteEmail = WirelessQuoteEmail
            await resend.emails.send({
                from: `${user.name} <melendez@robertdev.net>`,
                to: [data.quote.email],
                subject: 'Wireless Quote',
                reply_to: user.email,
                text: '',
                react: Template(data.quote)
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
