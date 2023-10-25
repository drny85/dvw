import React from 'react'

import { router } from 'expo-router'
import Eula from '@/common/components/Eula'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import { updateUser } from '@/features/auth/authActions'
import useAppSelector from '@/common/hooks/useAppSelector'

const ChatEula = () => {
    const dispatch = useAppDispatch()
    const user = useAppSelector((s) => s.auth.user)
    return (
        <Eula
            onAgreePress={async () => {
                try {
                    dispatch(updateUser({ ...user!, acceptedEULA: true }))
                    router.back()
                } catch (error) {
                    console.log(error)
                }
            }}
            onCancelPress={() => {
                router.back()
            }}
        />
    )
}

export default ChatEula
