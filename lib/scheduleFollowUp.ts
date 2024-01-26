import useAppDispatch from '@/common/hooks/useAppDispatch'
import { schedulePushNotification } from '@/common/hooks/useNotification'
import { updateReferral } from '@/features/referrals/referralActions'
import { Referral } from '@/types'

export const scheduleFollowUp = async (
    referral: Referral,
    follow: string | null
): Promise<boolean> => {
    const dispatch = useAppDispatch()
    try {
        if (!referral || !follow) return false
        dispatch(
            updateReferral({
                ...referral,
                followUpOn: follow
            })
        )

        await schedulePushNotification({
            title: 'Follow Up',
            data: { id: referral.id!, type: 'reminder' },
            body: `Get in contact with ${referral.name}`,
            date: follow
        })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
