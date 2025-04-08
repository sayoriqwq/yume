'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useState } from 'react'
import { ClientMDX } from './client-mdx'

interface MDXPreviewProps {
  markdown: string
  onChange?: (markdown: string) => void
}

// MDX预览组件
export function MDXPreview({ markdown }: Omit<MDXPreviewProps, 'onChange'>) {
  const [content, setContent] = useState(markdown)

  // 处理内容变化
  useEffect(() => {
    setContent(markdown)
  }, [markdown])

  return (
    <ScrollArea className="flex-1 h-full">
      <ClientMDX markdown={content} className="prose dark:prose-invert prose-sm max-w-none p-4" />
    </ScrollArea>
  )
}
