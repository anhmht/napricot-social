import fontsPreload from './config/Font'
import { getRunTimeConfig } from './config/RuntimeConfig'

// Debug: Check environment variables at config time
process.stdout.write(
  '\n🚀 nuxt.config.ts - Environment variables at config time:\n'
)
process.stdout.write(
  `FACEBOOK_APP_ID: ${process.env.FACEBOOK_APP_ID || 'NOT_SET'}\n`
)
process.stdout.write(
  `FACEBOOK_CONFIG_ID: ${process.env.FACEBOOK_CONFIG_ID || 'NOT_SET'}\n`
)
process.stdout.write(
  `OPERATION_URL: ${process.env.OPERATION_URL || 'NOT_SET'}\n`
)
process.stdout.write(
  `GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID || 'NOT_SET'}\n`
)

// Call getRunTimeConfig and log result
const runtimeConfig = getRunTimeConfig()
process.stdout.write(
  `🧪 Runtime config result: ${JSON.stringify(runtimeConfig, null, 2)}\n`
)

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
    port: Number(process.env.NUXT_PORT),
    https: {
      key: '.ssl/localhost.key',
      cert: '.ssl/localhost.crt'
    }
  },

  runtimeConfig: {
    public: {
      ...runtimeConfig
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Napricot Social',
      charset: 'utf-8',
      link: [...fontsPreload],
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
    // Ensure fonts are copied to the output directory
    buildAssetsDir: '/_nuxt/'
  },

  components: true,

  css: [
    // CSS file in the project
    '~/assets/styles/main.css'
  ],

  postcss: {
    plugins: {
      'postcss-import': {},
      'postcss-nested': {},
      autoprefixer: {}
    }
  }
})
