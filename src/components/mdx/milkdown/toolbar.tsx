'use client'

import React from 'react'
import { UploadButton } from './upload-button'

interface ToolbarProps {
  className?: string
}

export const Toolbar: React.FC<ToolbarProps> = ({ className }) => {
  return (
    <div className={`flex items-center space-x-2 p-2 border-b bg-gray-50 ${className}`}>
      <div className="flex-1 flex items-center">
        <div className="flex items-center space-x-1">
          <UploadButton className="bg-white shadow-sm" />
        </div>
      </div>
    </div>
  )
}
