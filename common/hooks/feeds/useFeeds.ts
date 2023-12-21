import { feedsColletion } from '@/lib/collections'
import { Feed } from '@/types'
import { onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import useAppSelector from '../useAppSelector'

export const useFeeds = () => {
    const [loading, setLoading] = useState(true)
    const [feeds, setFeeds] = useState<Feed[]>([])

    const user = useAppSelector((s) => s.auth.user)
    console.log('USer from useFeeds', user)
    useEffect(() => {
        if (!user) {
            setLoading(false)
            //setFeeds([])
            return
        }

        const blocked = [...user.blockedUsers]

        const feedQuery = query(feedsColletion, orderBy('createdAt', 'desc'))

        const unsubscribe = onSnapshot(feedQuery, (snapshot) => {
            setFeeds(
                snapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id } as Feed))
                    .filter((f) => blocked.findIndex((i) => i === f.user.id))
            )

            setLoading(false)
        })

        return unsubscribe
    }, [loading, user])

    return { loading, feeds }
}
