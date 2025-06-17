import fontsPreload from './config/Font'
import { type RuntimeConfig, getRunTimeConfig } from './config/RuntimeConfig'

const runtimeConfig: RuntimeConfig = getRunTimeConfig()

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
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
    app: {
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
