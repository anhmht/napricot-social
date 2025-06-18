export interface RuntimeConfig {
  operationUrl: string
  facebookAppId: string
  facebookConfigId: string
  googleClientId: string
}

export const getRunTimeConfig = () => {
  console.log('🔍 RuntimeConfig Debug:')
  console.log('OPERATION_URL:', process.env.OPERATION_URL)
  console.log('FACEBOOK_APP_ID:', process.env.FACEBOOK_APP_ID)
  console.log('FACEBOOK_CONFIG_ID:', process.env.FACEBOOK_CONFIG_ID)
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID)

  return {
    operationUrl: process.env.OPERATION_URL,
    facebookAppId: process.env.FACEBOOK_APP_ID || '',
    facebookConfigId: process.env.FACEBOOK_CONFIG_ID || '',
    googleClientId: process.env.GOOGLE_CLIENT_ID || ''
  }
}
