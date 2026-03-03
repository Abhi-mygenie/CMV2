import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.crmmygenie.app',
  appName: 'MyGenie CRM',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
