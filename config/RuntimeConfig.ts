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

  return {
    operationUrl: process.env.OPERATION_URL,
    facebookAppId: process.env.FACEBOOK_APP_ID || '',
    facebookConfigId: process.env.FACEBOOK_CONFIG_ID || '',
    googleClientId: process.env.GOOGLE_CLIENT_ID || ''
  }
}
