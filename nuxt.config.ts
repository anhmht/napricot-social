// Import the defineNuxtConfig function
import { defineNuxtConfig } from 'nuxt/config'
import { getRunTimeConfig } from './config/RuntimeConfig'

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
      key: '.ssl/dev.napricot.com.key',
      cert: '.ssl/dev.napricot.com.crt'
    }
  },

  runtimeConfig: {
    public: {
      ...getRunTimeConfig()
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
