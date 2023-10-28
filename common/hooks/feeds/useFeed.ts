import { Feed } from '@/types'
import { feedsColletion } from '@/lib/collections'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useFeed = (feedId: string) => {
    const [feed, setFeed] = useState<Feed | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!feedId) {
            setLoading(false)
            return
        }

        const feedRef = doc(feedsColletion, feedId)
        const unsubscribe = onSnapshot(feedRef, (snapshot) => {
            setFeed({ ...snapshot.data(), id: snapshot.id } as Feed)
            setLoading(false)
        })

        return unsubscribe
    }, [feedId])

    return { loading, feed }
}
