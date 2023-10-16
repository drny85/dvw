import React, { FC } from 'react'
import { Alert, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '@/firebase'
import { TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import useThemeColor from '@/common/hooks/useThemeColor'

interface UploadButtonProps {
    onImageUpload: (imageUrl: string) => void
    chatId: string
}

const UploadButton: FC<UploadButtonProps> = ({ onImageUpload, chatId }) => {
    const [imageUrl, setImageUrl] = React.useState<string | null>(null)
    const iconColor = useThemeColor('text')
    const handleImageUpload = async () => {
        const permission = await getCameraRollPermission()

        if (permission) {
            const result = await pickImage()

            if (!result.canceled) {
                if (!result.assets) return
                if (result.assets[0].type === 'image') {
                    const imageUrl = await uploadImageToFirebase(result)
                    onImageUpload(imageUrl!)
                } else {
                    Alert.alert('Please select an image')
                    return
                }
            }
        }
    }

    const getCameraRollPermission = async () => {
        if (Platform.OS !== 'web') {
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync()
            return status === 'granted'
        }
        return true
    }

    const pickImage = async () => {
        return ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2
        })
    }
    const isImage = (fileType: string) => {
        return fileType.includes('image')
    }

    const uploadImageToFirebase = async (
        image:
            | ImagePicker.ImagePickerResult
            | ImagePicker.ImagePickerCanceledResult
    ) => {
        if (!image.assets) return

        const response = await fetch(image.assets[0].uri)
        const blob = await response.blob()
        const storageRef = `${chatId}/images/${Date.now()}`

        const uploadRef = ref(storage, storageRef)
        const task = uploadBytesResumable(uploadRef, blob)
        task.on(
            'state_changed',
            (snapshot) => {},
            (error) => {
                console.log(error)
            },
            async () => {
                const imgUrl = await getDownloadURL(task.snapshot.ref)
                setImageUrl(imgUrl)
                return imgUrl
            }
        )

        return imageUrl
    }

    return (
        <TouchableOpacity onPress={handleImageUpload}>
            <FontAwesome name="camera" size={24} color={iconColor} />
        </TouchableOpacity>
    )
}

export default UploadButton
