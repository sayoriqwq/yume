'use client'

import type { PropsWithChildren } from 'react'
import { zhCN } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'
import { FontProvider } from './font-provider'
import { LenisProvider } from './lenis-provider'
import { SWRProvider } from './swr-provider'
import { ThemeProvider } from './theme-provider'

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute={['class', 'data-theme']}
      defaultTheme="system"
      enableSystem
    >
      <LenisProvider>
        <FontProvider>
          <SWRProvider>
            <ClerkProvider localization={zhCN}>
              {children}
            </ClerkProvider>
          </SWRProvider>
        </FontProvider>
      </LenisProvider>
    </ThemeProvider>
  )
}
