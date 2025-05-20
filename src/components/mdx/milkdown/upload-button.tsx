'use client'

import React, { useRef } from 'react'
import toast from 'react-hot-toast'
import { uploadImage } from './upload-image'

interface UploadButtonProps {
  className?: string
}

export const UploadButton: React.FC<UploadButtonProps> = ({ className }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0)
      return

    // 遍历选择的所有文件
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      if (!file || !file.type.startsWith('image/'))
        continue

      try {
        // 使用项目中已有的图片上传服务
        const result = await uploadImage(file)

        // 获取上传后的URL
        const imageUrl = result.data.url

        // 将图片URL插入到编辑器中（直接插入Markdown格式）
        const imageMarkdown = `![${file.name}](${imageUrl})\n`

        // 找到milkdown编辑器的文本区域并插入
        const editorTextarea = document.querySelector('.milkdown .ProseMirror') as HTMLElement
        if (editorTextarea) {
          // 创建一个自定义的粘贴事件，插入Markdown文本
          const clipboardData = new DataTransfer()
          clipboardData.setData('text/plain', imageMarkdown)
          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData: clipboardData as any,
            bubbles: true,
            cancelable: true,
          })
          editorTextarea.dispatchEvent(pasteEvent)
        }

        toast.success('图片上传成功')
      }
      catch (error) {
        toast.error('图片上传失败')
        console.error(error)
      }
    }

    // 清空input以便可以再次选择相同的文件
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        上传图片
      </button>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        multiple
      />
    </div>
  )
}
