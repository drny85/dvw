import { ExpoConfig } from 'expo/config'

const config: ExpoConfig = {
    name: 'Drasco',
    slug: 'drasco',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'drasco',
    userInterfaceStyle: 'automatic',
    splash: {
        image: './assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'net.robertdev.drasco',
        buildNumber: '1',
        infoPlist: {
            LSApplicationQueriesSchemes: ['dvw', 'telprompt', 'tel'],
            EXUpdatesEnabled: true
        }
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/images/adaptive-icon.png',
            backgroundColor: '#ffffff'
        },
        package: 'net.robertdev.drasco',
        versionCode: 1
    },
    web: {
        bundler: 'metro',
        output: 'server',
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
        url: 'https://u.expo.dev/fee3a90d-6448-46b1-a708-eabb1d817d42'
    }
}

export default config
