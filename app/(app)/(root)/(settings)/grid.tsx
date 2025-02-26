import { useEffect } from 'react'

import { router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
WebBrowser.warmUpAsync()

const Grid = () => {
    useEffect(() => {
        WebBrowser.openBrowserAsync('https://grid-rust-ten.vercel.app/', {
            controlsColor: 'red'
        })
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

export default Grid
