import type { NextConfig } from 'next'
import path from 'node:path'
import process from 'node:process'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias['.prisma/client/index-browser']
          = path.join(__dirname, 'src/generated/index-browser.js')
    return config
  },
  transpilePackages: ['next-mdx-remote'],
  images: {
    remotePatterns: [{ hostname: 'img.clerk.com' }, { protocol: 'https', hostname: 's3-yume.s3.ap-northeast-1.amazonaws.com', port: '', pathname: '/**' }],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default withBundleAnalyzer(nextConfig)
