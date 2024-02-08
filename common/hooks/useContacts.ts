import { useEffect, useState } from 'react'
import * as Contacts from 'expo-contacts'

export const useContacts = () => {
    const [contacts, setContacts] = useState<Contacts.Contact[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        ;(async () => {
            const { status } = await Contacts.requestPermissionsAsync()
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.Emails]
                })

                if (data.length > 0) {
                    setContacts(data)
                }
            }
            setLoading(false)
        })()
    }, [])

    return { contacts, loading }
}
