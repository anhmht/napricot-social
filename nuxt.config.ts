// Debug logging
console.log('🚀 Loading Nuxt config...')
console.log('FACEBOOK_APP_ID:', process.env.FACEBOOK_APP_ID || 'NOT_SET')
console.log('FACEBOOK_CONFIG_ID:', process.env.FACEBOOK_CONFIG_ID || 'NOT_SET')

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  ssr: false,
  nitro: {
    esbuild: {
      options: {
        target: 'node18'
      }
    }
  },

  /*
   ** SSL on local development (checkout README.md for instructions)
   */
  devServer: {
    host: 'dev.napricot.com',
    port: Number(process.env.NUXT_PORT) || 3000,
    https: {
      key: '.ssl/localhost.key',
      cert: '.ssl/localhost.crt'
    }
  },

  runtimeConfig: {
    public: {
      facebookAppId: process.env.FACEBOOK_APP_ID || '',
      facebookConfigId: process.env.FACEBOOK_CONFIG_ID || '',
      operationUrl: process.env.OPERATION_URL || 'https://api.napricot.com',
      googleClientId: process.env.GOOGLE_CLIENT_ID || ''
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Napricot Social',
      charset: 'utf-8',

      script: [
        {
          async: true,
          defer: true,
          crossorigin: 'anonymous',
          src: 'https://connect.facebook.net/en_US/sdk.js'
        },
        {
          async: true,
          defer: true,
          src: 'https://accounts.google.com/gsi/client'
        }
      ]
    },
    buildAssetsDir: '/_nuxt/'
  },

  components: true,

  css: ['~/assets/styles/main.css'],

  postcss: {
    plugins: {
      'postcss-import': {},
      'postcss-nested': {},
      autoprefixer: {}
    }
  }
})
