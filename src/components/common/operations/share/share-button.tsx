'use client'

import { useMounted } from '@/hooks/useMounted'
import { cn } from '@/lib/utils'
import { CheckIcon, Share2Icon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface ShareButtonProps {
  title: string
  text?: string
  className?: string
}

export function ShareButton({ title, text, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)
  const [url, setUrl] = useState('')
  const mounted = useMounted()

  // 在组件挂载后设置 URL 和检查分享 API
  useEffect(() => {
    if (mounted) {
      setUrl(window.location.href)
      setCanShare(
        typeof navigator !== 'undefined'
        && typeof navigator.share === 'function',
      )
    }
  }, [mounted])

  const handleShare = useCallback(async () => {
    if (!mounted)
      return

    try {
      if (canShare) {
        await navigator.share({
          title,
          text: text || `查看这篇文章: ${title}`,
          url,
        })
        toast({
          title: '分享成功',
          description: '感谢您的分享！',
        })
      }
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)

        toast({
          title: '链接已复制',
          description: '链接已复制到剪贴板',
        })

        setTimeout(() => setCopied(false), 2000)
      }
    }
    catch (error) {
      // 只有当错误不是因为用户取消分享时才显示错误提示
      if (!(error instanceof Error) || error.name !== 'AbortError') {
        console.error('分享失败:', error)
        toast({
          title: '分享失败',
          description: '请尝试手动复制链接',
          variant: 'destructive',
        })
      }
    }
  }, [title, text, url, canShare, mounted])

  return (
    <button
      onClick={handleShare}
      className={cn('hover:text-accent transition-colors duration-200', className)}
      aria-label={canShare ? '分享文章' : '复制链接'}
      disabled={!mounted} // 在客户端挂载前禁用按钮
    >
      {copied
        ? (
            <>
              <CheckIcon className="mr-2 h-4 w-4" />
            </>
          )
        : (
            <>
              <Share2Icon className="mr-2 h-4 w-4" />
            </>
          )}
    </button>
  )
}
