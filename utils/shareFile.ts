import * as Sharing from 'expo-sharing'

import * as FileSystem from 'expo-file-system'
interface ObjectItem {
    [key: string]: any
}

function convertArrayToCSV(objects: ObjectItem[]): string {
    let csvContent = ''
    if (objects.length > 0) {
        const headers = Object.keys(objects[0])
        // csvContent += headers.join(',') + '\n'
        csvContent += objects
            .map((obj) => headers.map((header) => obj[header]).join(','))
            .join('\n')
    }
    return csvContent
}

export async function shareCSV(
    objects: ObjectItem[],
    fileName: string
): Promise<void> {
    try {
        const available = await Sharing.isAvailableAsync()
        if (!available) return
        const csvContent = convertArrayToCSV(objects)
        console.log(JSON.stringify(csvContent, null, 2))

        const fileType = 'text/csv'
        const sharingOptions: Sharing.SharingOptions = {
            dialogTitle: 'Share CSV File',
            mimeType: fileType,
            UTI: 'public.comma-separated-values-text'
        }
        const fileUri = FileSystem.documentDirectory + fileName + '.csv'
        await FileSystem.writeAsStringAsync(fileUri, csvContent, {
            encoding: FileSystem.EncodingType.UTF8
        })
        await Sharing.shareAsync(fileUri, sharingOptions)
    } catch (error) {
        console.error('Error sharing CSV file:', error)
    }
}
