import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.intentnet.explorer',
  appName: 'IntentNet Explorer',
  webDir: 'dist',
  ios: {
    contentInset: 'never',
    backgroundColor: '#008080',
  },
}

export default config
