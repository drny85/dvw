import * as Contacts from 'expo-contacts'
import { modelName } from 'expo-device'

export interface ContactPerson {
    firstName: string
    phone: string
    email: string
    note: string
}

export async function saveContact(contact: ContactPerson): Promise<void> {
    try {
        console.log('DEVICE', modelName)
        if (modelName !== 'iPhone SE (3rd generation)') {
            console.log('Not work iPhone')
            return
        }
        const { status } = await Contacts.requestPermissionsAsync()
        if (status === 'granted') {
            const contactToAdd: Contacts.Contact = {
                name: contact.firstName,
                firstName: contact.firstName.split(' ')[0],
                lastName: contact.firstName.split(' ')[1],
                note: contact.note,
                contactType: 'person',
                phoneNumbers: [{ label: 'personal', number: contact.phone }],
                emails: [{ label: 'personal', email: contact.email }]
            }

            await Contacts.addContactAsync(contactToAdd)
            console.log('Contact saved successfully')
        } else {
            throw new Error('Permission to access contacts denied')
        }
    } catch (error) {
        console.error('Error saving contact:', error)
        // Handle errors here
    }
}
