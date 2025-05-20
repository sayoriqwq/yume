'use client'

import { MilkdownProvider } from '@milkdown/react'
import React from 'react'
import { MilkdownEditor } from './Editor'
import { Toolbar } from './toolbar'

export const MilkdownEditorWrapper: React.FC = () => {
  return (
    <div className="flex flex-col border rounded-md overflow-hidden shadow-sm bg-white">
      <MilkdownProvider>
        <Toolbar />
        <div className="p-4 min-h-[300px]">
          <MilkdownEditor />
        </div>
      </MilkdownProvider>
    </div>
  )
}
