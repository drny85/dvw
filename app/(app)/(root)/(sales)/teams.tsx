import Divider from '@/common/components/Divider'
import Loading from '@/common/components/Loading'
import Row from '@/common/components/Row'
import Screen from '@/common/components/Screen'
import Text from '@/common/components/Text'
import UserDRRs from '@/common/components/sales/UserDRRs'
import { useAllVerifiedUsers } from '@/common/hooks/auth/useAllVerifiedUsers'
import { useCoachess } from '@/common/hooks/auth/useCoaches'
import useThemeColor from '@/common/hooks/useThemeColor'
import { SIZES } from '@/constants/Sizes'
import { UserData } from '@/types'
import React, { useMemo, useState } from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import Animated, { FadeInLeft } from 'react-native-reanimated'

type TeamGroup = {
    [key: string]: UserData
}
type Team = {
    name: string
    users: UserData
}

const Teams = () => {
    const { coaches, loading } = useCoachess()
    const { usersData: users, loading: ld } = useAllVerifiedUsers()
    const bgColor = useThemeColor('tertiary')

    const data: TeamGroup = {}

    coaches.forEach((c) => {
        users.forEach((u) => {
            if (c.id == u.coachId) {
                if (data[c.name]) {
                    data[c.name].push(u)
                } else {
                    data[c.name] = [u]
                }
            }
        })
    })
    const teams = useMemo(() => {
        return Object.entries(data).map(([key, value]) => {
            return {
                name: key,
                users: value
            }
        })
    }, [data])

    const renderTeams: ListRenderItem<Team> = ({ index, item }) => {
        return (
            <Animated.View entering={FadeInLeft}>
                <Text capitalize fontFamily="SFBold">
                    {index + 1} - Team {item.name.split(' ')[1]}
                </Text>
                <Animated.View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        gap: SIZES.base,
                        padding: SIZES.base,
                        backgroundColor: bgColor + '30',

                        borderRadius: SIZES.base,
                        marginTop: SIZES.base
                    }}
                >
                    {item.users.map((u, i) => (
                        <UserDRRs id={u.id} name={u.name} key={u.id} />
                    ))}
                </Animated.View>
            </Animated.View>
        )
    }

    if (loading || ld) return <Loading />
    return (
        <Screen>
            <Row
                style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: SIZES.padding,

                    padding: SIZES.base,
                    marginTop: SIZES.base
                }}
            >
                <Text center fontFamily="QSBold" fontSize={22}>
                    Teams
                </Text>

                <Text center fontFamily="QSBold">
                    DRR WTD
                </Text>
            </Row>

            <FlatList
                data={teams}
                keyExtractor={(item) => item.name}
                renderItem={renderTeams}
                contentContainerStyle={{
                    padding: SIZES.padding,
                    gap: SIZES.padding
                }}
            />
        </Screen>
    )
}

export default Teams
