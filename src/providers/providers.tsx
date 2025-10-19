'use client'

import type { PropsWithChildren } from 'react'
import process from 'node:process'
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
            <ModalStackContainer m={motion}>
              {children}
            </ModalStackContainer>
          </FontProvider>
        </LenisProvider>
      </SWRProvider>
    </ThemeProvider>
  )
}
