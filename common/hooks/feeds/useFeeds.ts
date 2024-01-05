import { Feed } from '@/types'
import { onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import useAppSelector from '../useAppSelector'
import { feedsColletion } from '@/lib/collections'

export const useFeeds = () => {
    const [loading, setLoading] = useState(true)
    const [feeds, setFeeds] = useState<Feed[]>([])

    const user = useAppSelector((s) => s.auth.user)
    console.log('User from useFeeds', user)
    useEffect(() => {
        if (!user) {
            setLoading(false)
            //setFeeds([])
            return
        }
        const blocked = [...user.blockedUsers]
        return onSnapshot(feedsColletion, (snap) => {
            setFeeds(
                snap.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id } as Feed))
                    .filter((f) => blocked.findIndex((i) => i === f.user.id))
                    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            )
            setLoading(false)
        })
    }, [user])

    return { loading, feeds }
}
