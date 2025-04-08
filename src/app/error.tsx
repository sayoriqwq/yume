'use client'

import { ErrorComponent } from '@/components/common/error'
import { GoBack } from '@/components/common/operations/go-back'
import { RetryButton } from '@/components/common/operations/retry'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 使用toast显示错误信息
    toast.error(error.message || '发生了未知错误')

    // 记录错误到控制台
    console.error({
      error,
      digest: error.digest,
      message: error.message,
      stack: error.stack,
    })
  }, [error])

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <GoBack text="返回上一页" />
      </div>

      <ErrorComponent
        error={error}
        reset={reset}
        showRetry={false}
      />

      <div className="flex justify-center mt-6">
        <RetryButton
          onRetry={reset}
          text="重新加载页面"
          variant="default"
        />
      </div>
    </div>
  )
}
