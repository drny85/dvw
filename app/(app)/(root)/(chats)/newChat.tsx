import Header from '@/common/components/Header'
import KeyboardScreen from '@/common/components/KeyboardScreen'
import Loading from '@/common/components/Loading'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import TextInput from '@/common/components/TextInput'
import View from '@/common/components/View'
import useAppDispatch from '@/common/hooks/useAppDispatch'
import useAppSelector from '@/common/hooks/useAppSelector'
import { createChat } from '@/features/chats/chatsActions'
import { Chat } from '@/types'
import { analyzeTextForToxicity } from '@/utils/moderateMessage'
import { router } from 'expo-router'
import React from 'react'
import { Alert, Button } from 'react-native'

const ChatName = () => {
    const [topic, setTopic] = React.useState('')
    const user = useAppSelector((state) => state.auth.user)
    const loading = useAppSelector((state) => state.chats.loading)
    const dispatch = useAppDispatch()
    const onCreate = async () => {
        try {
            if (topic.length < 3) {
                return
            }
            const res = await analyzeTextForToxicity(topic)
            if (res) {
                Alert.alert("This chat's name might not be appropiate")
                return
            }
            const newChat: Chat = {
                name: topic,
                private: false,
                user: user!,
                createdAt: new Date().toISOString()
            }
            dispatch(createChat(newChat))
            setTopic('')
            router.back()
        } catch (error) {
            console.log('Error creating new chat', error)
        }
    }

    if (loading) return <Loading />
    return (
        <Screen>
            <Header title="New Chat" onPressBack={router.back} />
            <KeyboardScreen>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 100,
                        marginBottom: 100,
                        padding: 20
                    }}
                >
                    <Text fontSize={20}>Please type a Topic for this Chat</Text>
                    <View style={{ marginVertical: 20, width: '100%' }}>
                        <TextInput
                            placeholder="Ex. Wileress Question"
                            value={topic}
                            onChangeText={setTopic}
                            autoCapitalize="words"
                        />
                    </View>
                    <Button
                        disabled={topic.length < 3}
                        title="Create"
                        onPress={onCreate}
                    />
                </View>
            </KeyboardScreen>
        </Screen>
    )
}

export default ChatName
