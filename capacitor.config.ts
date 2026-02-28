import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.growbuttler.app',
  appName: 'GrowButtler',
  webDir: 'out',
  server: {
    // Load from deployed URL (change for local dev)
    url: 'https://growbuttler-landing.vercel.app',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic',
    scheme: 'GrowButtler',
    backgroundColor: '#F5F1E8'
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#F5F1E8'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#F5F1E8',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#F5F1E8'
    }
  }
};

export default config;
