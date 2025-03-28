import type { ReactNode } from 'react'
import { CommandDialog } from '@/components/common/command-dialog'
import { CommandSheet } from '@/components/common/command-sheet'
import { DashboardNav } from '@/components/dashboard/nav'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <DashboardNav />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <CommandSheet />
      <CommandDialog />
    </div>
  )
}
