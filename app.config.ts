import { ExpoConfig } from 'expo/config'

const config: ExpoConfig = {
    name: 'Drasco',
    slug: 'drasco',
    version: '1.0.4',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'drasco',
    userInterfaceStyle: 'automatic',
    platforms: ['ios', 'android'],
    splash: {
        image: './assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
    },

    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'net.robertdev.drasco-dvw',
        buildNumber: '5',

        infoPlist: {
            LSApplicationQueriesSchemes: [
                'dvw',
                'telprompt',
                'tel',
                'mailto',
                'sms'
            ],
            EXUpdatesEnabled: true
        }
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/images/adaptive-icon.png',
            backgroundColor: '#ffffff'
        },
        package: 'net.robertdev.drasco.dvw',
        versionCode: 4
    },
    web: {
        bundler: 'metro',
        output: 'static',
        favicon: './assets/images/favicon.png'
    },
    plugins: [
        'expo-router',
        'expo-font',
        'expo-notifications',

        [
            'expo-image-picker',
            {
                photosPermission:
                    'The app accesses your photos to let you share them with your friends.'
            }
        ],
        [
            'expo-contacts',
            {
                contactsPermission: 'Allow Drasco App to access your contacts.'
            }
        ]
    ],
    experiments: {
        tsconfigPaths: true,
        typedRoutes: true
    },
    extra: {
        router: {
            origin: false
        },
        eas: {
            projectId: 'e87419d5-8fcd-4daa-945c-ce36e902a7c6'
        }
    },
    owner: 'drny85',
    runtimeVersion: {
        policy: 'appVersion'
    },
    updates: {
        url: 'https://u.expo.dev/e87419d5-8fcd-4daa-945c-ce36e902a7c6'
    }
}

export default config
