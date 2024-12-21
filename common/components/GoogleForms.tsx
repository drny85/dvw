import { Button } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import View from './View'
import Text from './Text'
import useThemeColor from '../hooks/useThemeColor'
WebBrowser.warmUpAsync()
WebBrowser.maybeCompleteAuthSession()

const URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSeq-V-miLkWTDHS3XVkE_I58lDg5MvRNLD2Us5EH38sKCGoNw/viewform'

const GoogleForms = () => {
    const bg = useThemeColor('background')
    const goToForm = () => {
        WebBrowser.openBrowserAsync(URL, {
            enableDefaultShareMenuItem: true,
            showTitle: false,
            dismissButtonStyle: 'close',
            toolbarColor: '#ffffff',
            controlsColor: '#000000',
            presentationStyle:
                WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN
        })
            .then((res) => {
                if (res.type === 'dismiss') {
                    console.log('dismissed')
                }
            })
            .catch((e) => console.log(e))
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 20,
                backgroundColor: bg
            }}
        >
            <Text style={{ fontSize: 30, fontWeight: '600' }}>
                Google Forms
            </Text>
            <Button title="View Form" color={'green'} onPress={goToForm} />
        </View>
    )
}

export default GoogleForms
