import AsyncStorage from '@react-native-async-storage/async-storage'
export const FIRST_TIME = 'isFirstTime'
export async function isFirstTime(): Promise<boolean> {
    try {
        const isFirstTime = await AsyncStorage.getItem(FIRST_TIME)
        return isFirstTime === null // If isFirstTime is null, it means the user is opening the app for the first time
    } catch (error) {
        console.error('Error checking first time:', error)
        return true // Return true by default if an error occurs
    }
}

// Function to set the user as not first time, indicating that the app has been opened before
export async function setNotFirstTime() {
    try {
        await AsyncStorage.setItem(FIRST_TIME, 'false')
    } catch (error) {
        console.error('Error setting not first time:', error)
    }
}

export async function resetFirstTime() {
    try {
        await AsyncStorage.removeItem(FIRST_TIME)
    } catch (error) {
        console.error('Error setting not first time:', error)
    }
}
