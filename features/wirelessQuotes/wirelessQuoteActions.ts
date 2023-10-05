import { wirelessQuotesCollection } from '@/lib/collactions'
import { WirelessQuote } from '@/types'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'

export const saveWirelessQuote = createAsyncThunk(
    'wirelessQuote/save',
    async (quote: WirelessQuote) => {
        try {
            await addDoc(wirelessQuotesCollection, quote)
        } catch (error) {
            console.log('Error adding wireless quote: ', error)
        }
    }
)

export const deleteWirelessQuote = createAsyncThunk(
    'wirelessQuote/delete',
    async (quoteId: string) => {
        try {
            const ref = doc(wirelessQuotesCollection, quoteId)
            await deleteDoc(ref)
        } catch (error) {
            throw new Error(error as string)
        }
    }
)

export const updateWirelessQuote = createAsyncThunk(
    'wirelessQuote/update',
    async (quote: WirelessQuote) => {
        try {
            console.log(quote.id, quote.status)

            const ref = doc(wirelessQuotesCollection, quote.quoteId)

            await updateDoc(ref, quote)
        } catch (error) {
            return error
        }
    }
)
