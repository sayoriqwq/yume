'use client'

import { MilkdownProvider } from '@milkdown/react'
import React from 'react'
import { MilkdownEditor } from './Editor'

export const MilkdownEditorWrapper: React.FC = () => {
  return (
    <MilkdownProvider>
      <MilkdownEditor />
    </MilkdownProvider>
  )
}
