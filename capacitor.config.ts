import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.growbuttler.app',
  appName: 'GrowButtler',
  webDir: 'out',
  // Use static build - assets are packaged with the app
  // server: {
  //   url: 'https://growbuttler-landing.vercel.app',
  //   cleartext: true
  // },
  ios: {
    contentInset: 'automatic',
    scheme: 'GrowButtler',
    backgroundColor: '#F5F1E8',
    allowsLinkPreview: false
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#F5F1E8'
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 0,
      backgroundColor: '#F5F1E8',
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#F5F1E8'
    }
  }
};

export default config;
