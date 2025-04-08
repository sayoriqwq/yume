'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface GoBackProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  fallbackHref?: string
  asLink?: boolean
  text?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

// 返回按钮组件
export const GoBack = function GoBack({ ref, href, fallbackHref = '/', asLink = false, text = '返回', className, variant = 'ghost', ...props }: GoBackProps & { ref?: React.RefObject<HTMLButtonElement | null> }) {
  const router = useRouter()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    }
    else if (href) {
      router.push(href)
    }
    else {
      router.push(fallbackHref)
    }
  }

  if (asLink && href) {
    return (
      <Link
        href={href}
        className={cn(
          buttonVariants({ variant }),
          'gap-2 items-center',
          className,
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        {text}
      </Link>
    )
  }

  return (
    <Button
      ref={ref}
      variant={variant}
      className={cn('gap-2', className)}
      onClick={handleGoBack}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      {text}
    </Button>
  )
}

// 使用 hook 提供返回功能
export function useGoBack() {
  const router = useRouter()

  const goBack = (fallbackHref = '/') => {
    if (window.history.length > 1) {
      router.back()
      return true
    }
    else {
      router.push(fallbackHref)
      return false
    }
  }

  return { goBack }
}
