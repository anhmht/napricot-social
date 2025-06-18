export interface RuntimeConfig {
  operationUrl: string
  facebookAppId: string
  facebookConfigId: string
  googleClientId: string
}

export const getRunTimeConfig = () => {
  // Use process.stdout.write to ensure visibility in GitHub Actions
  process.stdout.write('\n🔍 RuntimeConfig Debug - Environment Variables:\n')
  process.stdout.write(
    `OPERATION_URL: ${process.env.OPERATION_URL || 'undefined'}\n`
  )
  process.stdout.write(
    `FACEBOOK_APP_ID: ${process.env.FACEBOOK_APP_ID || 'undefined'}\n`
  )
  process.stdout.write(
    `FACEBOOK_CONFIG_ID: ${process.env.FACEBOOK_CONFIG_ID || 'undefined'}\n`
  )
  process.stdout.write(
    `GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID || 'undefined'}\n`
  )

  const config = {
    operationUrl: process.env.OPERATION_URL || 'https://api.napricot.com',
    facebookAppId: process.env.FACEBOOK_APP_ID || '',
    facebookConfigId: process.env.FACEBOOK_CONFIG_ID || '',
    googleClientId: process.env.GOOGLE_CLIENT_ID || ''
  }

  process.stdout.write(
    `🧪 Final Runtime Config: ${JSON.stringify(config, null, 2)}\n`
  )

  return config
}
