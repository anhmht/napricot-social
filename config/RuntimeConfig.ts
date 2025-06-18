export interface RuntimeConfig {
  operationUrl: string
  facebookAppId: string
  facebookConfigId: string
  googleClientId: string
}

export const getRunTimeConfig = () => {
  return {
    operationUrl: process.env.OPERATION_URL,
    facebookAppId: process.env.FACEBOOK_APP_ID || '',
    facebookConfigId: process.env.FACEBOOK_CONFIG_ID || '',
    googleClientId: process.env.GOOGLE_CLIENT_ID || ''
  }
}
