import * as Contacts from 'expo-contacts'
import * as Device from 'expo-device'

export type LocalContact = {
    name: string
    lastName: string
    note: string
    phone: string
    email: string
}
export const saveContact = async (contact: LocalContact) => {
    console.log('Device', Device.deviceName)
    if (Device.deviceName !== 'iPhone SE') return

    const c: Contacts.Contact = {
        name: '',
        firstName: contact.name,
        lastName: contact.lastName,
        emails: [
            {
                label: 'personal',
                email: contact.email
            }
        ],
        note: contact.note,
        phoneNumbers: [
            {
                label: 'mobile',
                number: contact.phone
            }
        ],
        contactType: 'person'
    }

    try {
        await Contacts.addContactAsync(c)
        console.log('Contact added')
    } catch (error) {
        console.log('Error adding contact', error)
    }
}
