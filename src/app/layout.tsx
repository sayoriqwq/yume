import { CommandSheet } from '@/components/common/command-sheet'
import { Providers } from '@/providers/providers'
import { Toaster } from 'react-hot-toast'
import '@/styles/index.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className="scrollbar-thumb-sky-300 scrollbar-track-sky-50 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin"
    >
      <body>
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-center" />
        <CommandSheet />
      </body>
    </html>
  )
}
