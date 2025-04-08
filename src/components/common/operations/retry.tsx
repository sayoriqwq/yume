'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { RefreshCw } from 'lucide-react'
import * as React from 'react'

interface RetryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onRetry: () => void
  loading?: boolean
  text?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export const RetryButton = function RetryButton({ ref, onRetry, loading = false, text = '重试', className, variant = 'outline', ...props }: RetryButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) {
  return (
    <Button
      ref={ref}
      variant={variant}
      className={cn('gap-2', className)}
      onClick={onRetry}
      disabled={loading}
      {...props}
    >
      <RefreshCw className={cn('h-4 w-4', { 'animate-spin': loading })} />
      {text}
    </Button>
  )
}

export function useRetry<T>(
  asyncFn: () => Promise<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: Error) => void,
) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [data, setData] = React.useState<T | null>(null)

  const execute = React.useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await asyncFn()
      setData(result)
      onSuccess?.(result)
      return result
    }
    catch (err) {
      const error = err instanceof Error ? err : new Error('未知错误')
      setError(error)
      onError?.(error)
      throw error
    }
    finally {
      setLoading(false)
    }
  }, [asyncFn, onSuccess, onError])

  const retry = React.useCallback(() => {
    return execute()
  }, [execute])

  return {
    retry,
    loading,
    error,
    data,
    execute,
  }
}
