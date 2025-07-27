#!/bin/env/node
import fs from 'fs'

// Only use SSL in development
if (process.env.NODE_ENV !== 'production') {
  try {
    process.env.NITRO_SSL_CERT = fs.readFileSync('.ssl/localhost.crt')
    process.env.NITRO_SSL_KEY = fs.readFileSync('.ssl/localhost.key')
  } catch (error) {
    console.warn('SSL certificates not found, running without HTTPS')
  }
}

process.env.HOST = process.env.HOST || '0.0.0.0'
process.env.PORT = process.env.PORT || '3000'

await import('./.output/server/index.mjs')
