import { Toaster } from 'react-hot-toast'
import { CommandSheet } from '@/components/common/command-sheet'
import { SearchModal } from '@/features/search/search-modal'
import { Footer } from '@/layout/footer'
import { Header } from '@/layout/header'
import { Providers } from '@/providers/providers'
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
          <Header />
          {children}
          <Footer />
        </Providers>
        <SearchModal />
        <Toaster position="top-center" />
        <CommandSheet />
      </body>
    </html>
  )
}
