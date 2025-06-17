export interface RuntimeConfig {
  baseUrl: string
  apiVersion: string
  operationUrl: string
  facebookAppId: string
  facebookConfigId: string
  googleClientId: string
}

export const getRunTimeConfig = (): RuntimeConfig => {
  return {
    baseUrl: process.env.BASE_URL as string,
    operationUrl: process.env.OPERATION_URL as string,
    apiVersion: 'v1',
    facebookAppId: process.env.FACEBOOK_APP_ID as string,
    facebookConfigId: process.env.FACEBOOK_CONFIG_ID as string,
    googleClientId: process.env.GOOGLE_CLIENT_ID as string
  }
}
