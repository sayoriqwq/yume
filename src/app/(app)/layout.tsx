import { SearchModal } from '@/components/common/operations/meilisearch/search-modal'
import { Footer } from '@/layout/footer'
import { Header } from '@/layout/header'
import { Toaster } from 'react-hot-toast'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <Toaster position="top-center" />
      <SearchModal />
    </>
  )
}
