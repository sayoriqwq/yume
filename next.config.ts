import type { NextConfig } from 'next'
import process from 'node:process'

const isDev = process.argv.includes('dev')
const isBuild = process.argv.includes('build')
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1'
  import('velite').then(m => m.build({ watch: isDev, clean: !isDev }))
}

const nextConfig: NextConfig = {
  images: {
    // remotePatterns: [{ hostname: 'r2.sayoriqwq.com' }],
    loaderFile: './src/service/wsrv-loader.ts',
  },
}

export default nextConfig
