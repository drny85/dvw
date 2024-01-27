import { ExpoConfig } from 'expo/config'

const config: ExpoConfig = {
    name: 'DVW',
    slug: 'dvw',
    version: '1.0.5',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'dvw',
    userInterfaceStyle: 'automatic',
    splash: {
        image: './assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'net.robertdev.dvw',
        buildNumber: '5',
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
        package: 'net.robertdev.dvw',
        versionCode: 5
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
            projectId: '888d6d2c-fe0d-48a6-b255-50cc59d1deef'
        }
    },
    owner: 'drny85',
    runtimeVersion: {
        policy: 'appVersion'
    },
    updates: {
        url: 'https://u.expo.dev/888d6d2c-fe0d-48a6-b255-50cc59d1deef'
    }
}

export default config
