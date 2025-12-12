import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chate2ee.app',
  appName: 'Chat E2EE',
  webDir: 'build',
  // Important: pour l'APK, charger les assets locaux (pas d'URL distante)
  // Si besoin de dev en live, réactiver 'server.url' et re-synchroniser.
  server: {
    cleartext: true,
    androidScheme: 'https'
  },
  plugins: {
    // Configuration des permissions
    Permissions: {
      camera: true,
      microphone: true
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;
