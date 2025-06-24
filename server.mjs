#!/bin/env/node
import fs from 'fs'

process.env.NITRO_SSL_CERT = fs.readFileSync('.ssl/localhost.crt')
process.env.NITRO_SSL_KEY = fs.readFileSync('.ssl/localhost.key')
process.env.HOST = '0.0.0.0'
process.env.PORT = '3000'

await import('./.output/server/index.mjs')
