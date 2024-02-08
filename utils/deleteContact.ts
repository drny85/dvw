import * as Contacts from 'expo-contacts'

export const deleteContact = async (email: string) => {
    try {
        const c = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Emails]
        })
        const found = c.data
            .map((i) => i.emails)
            .flat()
            .find((e) => e?.email === email)

        if (found) {
            if (found.id) {
                await Contacts.removeContactAsync(found.id)
            }

            console.log('Contact Deleted')
        }
    } catch (error) {
        console.log('Error deleting Contact', error)
    }
}
