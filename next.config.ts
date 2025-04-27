import type { NextConfig } from 'next'
import process from 'node:process'
import bundleAnalyzer from '@next/bundle-analyzer'
import { codeInspectorPlugin } from 'code-inspector-plugin'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.plugins.push(codeInspectorPlugin({ bundler: 'webpack' }))
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
