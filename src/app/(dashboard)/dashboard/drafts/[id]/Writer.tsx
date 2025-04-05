'use client'

import { useArticleDetail, useArticlesData } from '@/atoms/dashboard/hooks/useArticle'
import MDXEditorWrapper from '@/components/mdx/MDXEditor'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

interface WriterProps {
  id: number
}

export function Writer({ id }: WriterProps) {
  const { isLoading, error, updateArticle } = useArticlesData('DRAFT')
  const { article } = useArticleDetail(id) // Rename to avoid confusion

  // State holds the full Prisma Article type, potentially null initially
  const [draftData, setDraftData] = useState(null)
  // Content state is always a string
  const [content, setContent] = useState<string>('')

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div>
        Error:
        {error.message}
      </div>
    )
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    // Update draftData state, ensuring it remains a valid Article object
    setDraftData((prev) => {
      if (!prev) {
        console.error('Attempted to update content before draft data was loaded.')
        return null
      }
      // Update content, ensuring it's a string
      return { ...prev, content: newContent }
    })
  }

  const handleSave = async () => {
    if (draftData) {
      try {
        // Prepare the payload for updateArticle.
        // Since draftData is now a full Article object, and updateArticle
        // expects Partial<Article>, we can pass draftData directly,
        // ensuring the content field reflects the latest state.
        const payload: Partial<Article> = {
          ...draftData,
          content, // Pass the up-to-date content string
        }

        await updateArticle(id, payload)
        toast.success('草稿已保存!')
      }
      catch (e) {
        console.error('Failed to save draft:', e)
        toast.error('保存失败，请稍后再试。')
      }
    }
    else {
      console.error('Cannot save, draft data is missing.')
      toast.error('无法保存，数据丢失。')
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          编辑草稿 -
          {article.title || 'Untitled'}
        </h1>
        <Button onClick={handleSave} disabled={isLoading || !draftData}>保存</Button>
      </div>

      <div className="grid gap-6 border rounded-md p-4 min-h-[600px]">
        <MDXEditorWrapper
          key={id}
          markdown={JSON.parse(article.content)}
          onChange={handleContentChange}
        />
      </div>
    </div>
  )
}
