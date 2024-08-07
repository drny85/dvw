import Header from '@/common/components/Header'
import Loading from '@/common/components/Loading'
import Screen from '@/common/components/Screen'
import { useUsers } from '@/common/hooks/auth/useUsers'
import useAppSelector from '@/common/hooks/useAppSelector'
import { SIZES } from '@/constants/Sizes'
import { router } from 'expo-router'
import { Image, ScrollView } from 'react-native'

import Text from '@/common/components/Text'
import View from '@/common/components/View'
import { AppUser } from '@/types'

const likes = () => {
    const feed = useAppSelector((s) => s.feeds.feed)

    if (!feed) return null
    const { usersData, loading } = useUsers(feed?.likes)

    if (loading) return <Loading />
    return (
        <Screen>
            <Header title="Likes" onPressBack={router.back} />
            <Text
                style={{
                    fontSize: 18,
                    marginLeft: SIZES.padding,
                    marginTop: SIZES.base
                }}
            >
                Liked By
            </Text>

            <ScrollView
                contentContainerStyle={{ padding: SIZES.padding }}
                showsVerticalScrollIndicator={false}
            >
                {usersData?.map((user) => (
                    <UserLiked user={user} key={user.id} />
                ))}
            </ScrollView>
        </Screen>
    )
}

export default likes

type Props = {
    user: AppUser
}
const UserLiked = ({ user }: Props) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: SIZES.padding
            }}
        >
            <Image
                resizeMode="cover"
                source={{
                    uri:
                        user.image ||
                        'https://firebasestorage.googleapis.com/v0/b/ayuda-b2079.appspot.com/o/verizon.png?alt=media&token=4d4c0560-4c17-4bc4-a73f-d4740312cb3c'
                }}
                style={{
                    borderRadius: 30,
                    marginRight: SIZES.padding,
                    height: 60,
                    width: 60
                }}
            />

            <Text capitalize fontSize={16} fontFamily="OWRegelar">
                {user.name}
            </Text>
        </View>
    )
}
