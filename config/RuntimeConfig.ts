export interface RuntimeConfig {
  operationUrl: string
  facebookAppId: string
  facebookConfigId: string
  googleClientId: string
  threadsAppId: string
  pinterestAppId: string
}

export const getRunTimeConfig = (): RuntimeConfig => {
  const config = {
    operationUrl: process.env.OPERATION_URL as string,
    facebookAppId: process.env.FACEBOOK_APP_ID as string,
    facebookConfigId: process.env.FACEBOOK_CONFIG_ID as string,
    googleClientId: process.env.GOOGLE_CLIENT_ID as string,
    threadsAppId: process.env.THREADS_APP_ID as string,
    pinterestAppId: process.env.PINTEREST_APP_ID as string
  }

  return config
}
