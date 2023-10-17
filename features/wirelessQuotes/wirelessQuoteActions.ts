import { wirelessQuotesCollection } from '@/lib/collactions'
import { WirelessQuote } from '@/types'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'

export const saveWirelessQuote = createAsyncThunk<
    Promise<string | null>,
    WirelessQuote
>('wirelessQuote/save', async (quote: WirelessQuote) => {
    try {
        const res = await addDoc(wirelessQuotesCollection, quote)
        return res.id
    } catch (error) {
        console.log('Error adding wireless quote: ', error)
        return null
    }
})

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
