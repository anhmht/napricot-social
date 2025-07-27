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

  // Better build configuration for SPA
  experimental: {
    payloadExtraction: false
  },

  // Optimize chunk splitting
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
            moment: ['moment']
          }
        }
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
    buildAssetsDir: '/_nuxt/',
    // Ensure proper base URL for production
    baseURL: process.env.NODE_ENV === 'production' ? '/' : undefined
  },

  components: true,

  css: ['~/assets/styles/main.css'],

  imports: {
    dirs: ['models/*.ts']
  },

  postcss: {
    plugins: {
      'postcss-import': {},
      'postcss-nested': {},
      autoprefixer: {}
    }
  }
})
