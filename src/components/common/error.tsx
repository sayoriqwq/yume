'use client'

import { Button } from '@/components/ui/button'
import { errorLogger, errorToaster } from '@/lib/error-handler'
import { YumeError } from '@/lib/YumeError'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ErrorComponentProps {
  error: YumeError | Error | string
  reset?: () => void
  retry?: () => void
  showReset?: boolean
  showRetry?: boolean
  showHome?: boolean
}

function getErrorMessage(error: YumeError | Error | string) {
  let errorMessage = '未知错误'
  if (error instanceof YumeError) {
    errorMessage = error.message
  }
  else if (error instanceof Error) {
    errorMessage = error.message
  }
  else {
    errorMessage = String(error)
  }
  return errorMessage
}

export function ErrorComponent({
  error,
  reset,
  retry,
  showReset = true,
  showRetry = true,
  showHome = true,
}: ErrorComponentProps) {
  const router = useRouter()
  const errorMessage = getErrorMessage(error)
  errorToaster(error)
  errorLogger(error)

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 p-6">
      <div className="flex flex-col items-center text-center space-y-3">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h1 className="text-2xl font-bold">{errorMessage}</h1>
        <p className="text-muted-foreground max-w-md">
          抱歉，发生了一些错误。您可以尝试刷新页面或返回首页。
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {showReset && reset && (
          <Button variant="outline" onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            重试
          </Button>
        )}

        {showRetry && retry && (
          <Button onClick={retry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新页面
          </Button>
        )}

        {showHome && (
          <Button variant="secondary" onClick={handleGoHome}>
            <Home className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        )}
      </div>
    </div>
  )
}
