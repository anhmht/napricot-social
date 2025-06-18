export interface RuntimeConfig {
  operationUrl: string
  facebookAppId: string
  facebookConfigId: string
  googleClientId: string
}

export const getRunTimeConfig = () => {
  // Force output to stderr so it shows in GitHub Actions logs
  console.error('🔍 RuntimeConfig Debug:')
  console.error('OPERATION_URL:', process.env.OPERATION_URL || 'undefined')
  console.error('FACEBOOK_APP_ID:', process.env.FACEBOOK_APP_ID || 'undefined')
  console.error(
    'FACEBOOK_CONFIG_ID:',
    process.env.FACEBOOK_CONFIG_ID || 'undefined'
  )
  console.error(
    'GOOGLE_CLIENT_ID:',
    process.env.GOOGLE_CLIENT_ID || 'undefined'
  )

  // Temporary test values to verify the config structure works
  const testConfig = {
    operationUrl: process.env.OPERATION_URL || 'https://api.napricot.com',
    facebookAppId: process.env.FACEBOOK_APP_ID || 'test-facebook-app-id',
    facebookConfigId:
      process.env.FACEBOOK_CONFIG_ID || 'test-facebook-config-id',
    googleClientId: process.env.GOOGLE_CLIENT_ID || 'test-google-client-id'
  }

  console.error('🧪 Final config:', JSON.stringify(testConfig, null, 2))

  return testConfig
}
