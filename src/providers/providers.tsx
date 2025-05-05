'use client'

import type { PropsWithChildren } from 'react'
import process from 'process'
import { zhCN } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { ModalStackContainer } from 'rc-modal-sheet'
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
      <SWRProvider>
        <LenisProvider>
          <FontProvider>
            <ClerkProvider localization={zhCN} publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
              <ModalStackContainer m={motion}>
                {children}
              </ModalStackContainer>
            </ClerkProvider>
          </FontProvider>
        </LenisProvider>
      </SWRProvider>
    </ThemeProvider>
  )
}
