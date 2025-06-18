export interface RuntimeConfig {
  operationUrl: string
  facebookAppId: string
  facebookConfigId: string
  googleClientId: string
}

export const getRunTimeConfig = () => {
  // File-based debugging to prove this function is called
  try {
    const fs = require('fs')
    const debugInfo = {
      timestamp: new Date().toISOString(),
      env: {
        OPERATION_URL: process.env.OPERATION_URL || 'undefined',
        FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || 'undefined',
        FACEBOOK_CONFIG_ID: process.env.FACEBOOK_CONFIG_ID || 'undefined',
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'undefined'
      }
    }
    fs.writeFileSync(
      'debug-runtime-config.txt',
      JSON.stringify(debugInfo, null, 2)
    )
    console.log('🔍 RuntimeConfig debug file written')
  } catch (e) {
    console.log(
      'Could not write RuntimeConfig debug file:',
      e instanceof Error ? e.message : String(e)
    )
  }

  const config = {
    operationUrl: process.env.OPERATION_URL || 'https://api.napricot.com',
    facebookAppId: process.env.FACEBOOK_APP_ID || '',
    facebookConfigId: process.env.FACEBOOK_CONFIG_ID || '',
    googleClientId: process.env.GOOGLE_CLIENT_ID || ''
  }

  return config
}
