import type { ImageLoaderProps } from 'next/image'
import process from 'node:process'
import { siteConfig } from '@/config/site'
import { WSRV_BASE } from '@/constants/service'

const AUTO_FORMAT_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'bmp', 'tif', 'tiff'])

function isBypassProtocol(src: string) {
  return /^(?:data|blob):/i.test(src)
}

function toAbsoluteSrc(src: string) {
  if (src.startsWith('http'))
    return src
  if (src.startsWith('//'))
    return `https:${src}`

  const base = siteConfig.assetsDomain.replace(/\/$/, '')
  return `${base}/${src.replace(/^\//, '')}`
}

function stripProtocol(url: string) {
  try {
    const parsed = new URL(url)
    return `${parsed.host}${parsed.pathname}${parsed.search}`
  }
  catch {
    return url.replace(/^https?:\/\//, '')
  }
}

function encodeForWsrv(url: string) {
  // wsrv 要求 query 中的 ? & 做额外编码，其它部分沿用 encodeURI 即可
  return encodeURI(url).replace(/\?/g, '%3F').replace(/&/g, '%26')
}

function shouldAutoFormat(src: string) {
  const path = src.split('?')[0]
  const match = /\.([a-z0-9]+)$/i.exec(path)
  const ext = match?.[1]?.toLowerCase()

  if (!ext)
    return false
  return AUTO_FORMAT_EXTENSIONS.has(ext)
}

// 裁剪/压缩/格式转换交给 wsrv
export default function wsrvLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!src || Number.isNaN(width))
    return src
  if (isBypassProtocol(src))
    return src

  const absoluteSrc = toAbsoluteSrc(src)

  if (absoluteSrc.startsWith(WSRV_BASE))
    return absoluteSrc

  const normalizedWidth = Number.isFinite(width) && width > 0 ? Math.round(width) : undefined
  if (!normalizedWidth)
    return absoluteSrc

  const normalizedQuality = Math.min(Math.max(quality ?? 75, 1), 100)
  const stripped = stripProtocol(absoluteSrc)
  const urlParam = encodeForWsrv(stripped)

  const queryParts = [`url=${urlParam}`, `w=${normalizedWidth}`, `q=${normalizedQuality}`, 'we=1']

  if (process.env.NODE_ENV === 'production') {
    queryParts.push('maxage=31536000')
  }

  if (shouldAutoFormat(absoluteSrc)) {
    queryParts.push('output=webp')
  }

  return `${WSRV_BASE}/?${queryParts.join('&')}`
}
