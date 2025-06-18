export interface RuntimeConfig {
  operationUrl: string
  facebookAppId: string
  facebookConfigId: string
  googleClientId: string
}

export const getRunTimeConfig = () => {
  // Use console.log and console.error to ensure visibility
  console.log('🔍 RuntimeConfig Debug - Environment Variables:')
  console.log('OPERATION_URL:', process.env.OPERATION_URL || 'undefined')
  console.log('FACEBOOK_APP_ID:', process.env.FACEBOOK_APP_ID || 'undefined')
  console.log(
    'FACEBOOK_CONFIG_ID:',
    process.env.FACEBOOK_CONFIG_ID || 'undefined'
  )
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID || 'undefined')

  const config = {
    operationUrl: process.env.OPERATION_URL || 'https://api.napricot.com',
    facebookAppId: process.env.FACEBOOK_APP_ID || '',
    facebookConfigId: process.env.FACEBOOK_CONFIG_ID || '',
    googleClientId: process.env.GOOGLE_CLIENT_ID || ''
  }

  console.log('🧪 Final Runtime Config:', JSON.stringify(config, null, 2))

  return config
}
