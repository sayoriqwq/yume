import { Aboreto, Inter } from 'next/font/google'
import localFont from 'next/font/local'

const sansFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
  // 中 -> 西 -> generic -> emoji
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'PingFang SC',
    'Hiragino Sans GB',
    'Microsoft YaHei',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'Noto Sans',
    'Noto Sans SC',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'Noto Color Emoji',
  ],
})

const serifFont = localFont({
  src: [
    { path: '../assets/fonts/LXGWWenKai-Light.ttf', weight: '300', style: 'normal' },
    { path: '../assets/fonts/LXGWWenKai-Medium.ttf', weight: '400', style: 'normal' },
    { path: '../assets/fonts/LXGWWenKai-Regular.ttf', weight: '500', style: 'normal' },
  ],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
  fallback: ['Noto Serif SC', 'serif'],
})

const aboretoFont = Aboreto({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-aboreto',
  display: 'swap',
})

export { aboretoFont, sansFont, serifFont }
