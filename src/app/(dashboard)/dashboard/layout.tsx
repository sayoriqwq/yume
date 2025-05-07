import type { ReactNode } from 'react'
import { CommandDialog } from '@/components/common/command-dialog'
import { CommandSheet } from '@/components/common/command-sheet'
import { LoadingIcon } from '@/components/common/loading/loading-icon'
import { ModeToggle } from '@/components/common/operations/mode-toggle'
import { DashboardNav } from '@/components/dashboard/nav'
import { UserButton } from '@clerk/nextjs'
import { Suspense } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

function PageLoadingFallback() {
  return (
    <div className="flex-center h-full w-full">
      <LoadingIcon />
    </div>
  )
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <DashboardNav />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-end px-6 gap-4">
            <UserButton />
            <ModeToggle />
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <Suspense fallback={<PageLoadingFallback />}>
              {children}
            </Suspense>
          </main>
        </div>
      </div>
      <CommandSheet />
      <CommandDialog />
    </div>
  )
}
