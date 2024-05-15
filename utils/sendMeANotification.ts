export const sendMe = async (name: string) => {
    try {
        const token = 'ExponentPushToken[3_OvrIDdTdIAPc0haVxQ1H]'

        const sent = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: token,
                title: 'New Sign IN',
                body: `${name} just signed in`
            })
        })
        console.log('SENT', sent.ok, token)
    } catch (error) {
        console.log(error)
    }
}
