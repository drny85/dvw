import { useEffect } from 'react'

import { router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
WebBrowser.warmUpAsync()

const Porting = () => {
    useEffect(() => {
        WebBrowser.openBrowserAsync(
            'https://www.verizon.com/switch-to-verizon/check-status/',
            {
                controlsColor: 'red'
            }
        )
            .then((res) => {
                if (res.type === 'cancel') {
                    WebBrowser.coolDownAsync()
                    router.back()
                }
            })
            .catch((e) => console.log(e))
    }, [])
    return null
}

export default Porting
