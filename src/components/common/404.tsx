import { GoBack } from '@/components/common/operations/go-back'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home } from 'lucide-react'
import Link from 'next/link'

export function NotFound404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] py-12 px-4">
      <div className="flex flex-col items-center text-center space-y-4 max-w-md">
        <div className="bg-muted p-6 rounded-full">
          <FileQuestion className="h-16 w-16 text-muted-foreground" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight font-aboreto">404</h1>
        <h2 className="text-2xl font-semibold">页面未找到</h2>

        <p className="text-muted-foreground mt-2">
          抱歉，您访问的页面不存在或已被移除。请检查您输入的网址是否正确，或返回首页继续浏览。
        </p>

        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <GoBack
            text="返回上一页"
            variant="outline"
          />

          <Button asChild>
            <Link href="/" className="gap-2">
              <Home className="h-4 w-4" />
              返回首页
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
