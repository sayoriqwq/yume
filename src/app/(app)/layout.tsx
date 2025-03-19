import { SearchModal } from '@/components/common/operations/meilisearch/search-modal'
import { Footer } from '@/layout/footer'
import { Header } from '@/layout/header'

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
      <SearchModal />
    </>
  )
}
