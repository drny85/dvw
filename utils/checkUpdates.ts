import * as Updates from 'expo-updates'
export async function onFetchUpdateAsync() {
    try {
        if (process.env.NODE_ENV === 'production') {
            console.log('Update')
            const update = await Updates.checkForUpdateAsync()

            if (update.isAvailable) {
                await Updates.fetchUpdateAsync()
                await Updates.reloadAsync()
            }
        }
    } catch (error) {
        // You can also add an alert() to see the error message in case of an error when fetching updates.

        console.log(`Error fetching latest Expo update: ${error}`)
    }
}
