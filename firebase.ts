import { initializeApp, getApps, getApp } from 'firebase/app'
import { initializeFirestore, getFirestore } from 'firebase/firestore'
import {
    initializeAuth,
    getReactNativePersistence
} from 'firebase/auth/react-native'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getStorage } from 'firebase/storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
    CollectionReference,
    DocumentData,
    collection
} from 'firebase/firestore'
import { WirelessQuote } from './types'

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_APIKEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTHDOMAIN,
    databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASEURL,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDERID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APPID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

export const db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true
})
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
})
const functions = getFunctions(app)

export const firestore = getFirestore(app)

export const deleteUserAccount = (name: string) =>
    httpsCallable<{ uid: string }, Response>(functions, name)

export const sendEmail = () =>
    httpsCallable<{ quote: WirelessQuote }>(functions, 'sendEmail')

//const auth = getAuth(authApp.app);
// export const db = getFirestore(app);

// export const auth = initializeAuth(app);
export const storage = getStorage(app)

export const createCollection = <T = DocumentData>(collectionName: string) => {
    return collection(db, collectionName) as CollectionReference<T>
}
