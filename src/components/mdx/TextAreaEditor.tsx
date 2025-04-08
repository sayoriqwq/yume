'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Download, Redo, Save, Undo, Upload } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Textarea } from '../ui/textarea'

export interface TextAreaEditorProps {
  content: string
  onChange?: (value: string) => void
  onSave?: () => void
  className?: string
}

export function TextAreaEditor({ content, onChange, onSave, className }: TextAreaEditorProps) {
  const [value, setValue] = useState(content || '')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // 当传入的content变化时更新编辑器内容
  useEffect(() => {
    if (content !== value) {
      setValue(content)
    }
  }, [content, value])

  // 内容变化处理
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onChange?.(newValue)
  }

  // 撤销操作
  const handleUndo = () => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      document.execCommand('undo')
    }
  }

  // 重做操作
  const handleRedo = () => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      document.execCommand('redo')
    }
  }

  // 导入文件
  const handleImport = () => {
    fileInputRef.current?.click()
  }

  // 处理文件导入
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file)
      return

    const reader = new FileReader()
    reader.onload = () => {
      const content = reader.result as string
      setValue(content)
      onChange?.(content)
    }
    reader.readAsText(file)

    // 重置文件输入，以便可以再次选择相同的文件
    e.target.value = ''
  }

  // 导出文件
  const handleExport = () => {
    const blob = new Blob([value], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              title="撤销"
              onClick={handleUndo}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              title="重做"
              onClick={handleRedo}
            >
              <Redo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              title="导入"
              onClick={handleImport}
            >
              <Upload className="h-4 w-4" />
              <input
                type="file"
                accept=".md,.markdown"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </Button>
            <Button
              variant="outline"
              size="sm"
              title="导出"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          {onSave && (
            <Button
              size="sm"
              onClick={onSave}
            >
              <Save className="h-4 w-4 mr-1" />
              保存
            </Button>
          )}
        </div>

        <Textarea
          className="bg-neutral-50"
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder="在此处输入Markdown内容..."
          spellCheck="false"
        />
      </CardContent>
    </Card>
  )
}
