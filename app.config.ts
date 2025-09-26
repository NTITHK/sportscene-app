import { ExpoConfig } from 'expo/config';


const config: ExpoConfig = {
name: 'Sportscene App',
slug: 'sportscene-app',
scheme: 'sportscene',
plugins: ['expo-router'],
icon: './assets/images/icon.png',
splash: {
image: './assets/images/splash-icon.png',
resizeMode: 'contain',
backgroundColor: '#ffffff'
},
ios: {
supportsTablet: true,
bundleIdentifier: 'com.sportscene.app'
},
android: {
package: 'com.sportscene.app'
},
experiments: {
typedRoutes: true
},
extra: {
apiBaseUrl: 'https://app-test.sportsceneltd.com', // ← set this to your real API base URL
apiPaths: {
login: '/api/login.php',
register: '/api/register.php',
forgot: '/api/forgot.php',
members: '/api/members.php'
},
defaultLocale: 'zh-Hant'
}
};


export default config;