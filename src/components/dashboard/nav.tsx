'use client'

import { Logo } from '@/layout/header/logo'
import { cn } from '@/lib/utils'
import {
  FileText,
  FolderTree,
  LayoutDashboard,
  Link as LinkIcon,
  MessageSquare,
  Tags,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { memo, useCallback, useTransition } from 'react'

const navItems = [
  {
    title: '仪表盘',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: '文章',
    href: '/dashboard/articles',
    icon: FileText,
  },
  {
    title: '分类',
    href: '/dashboard/categories',
    icon: FolderTree,
  },
  {
    title: '标签',
    href: '/dashboard/tags',
    icon: Tags,
  },
  {
    title: '评论',
    href: '/dashboard/comments',
    icon: MessageSquare,
  },
  {
    title: '友链',
    href: '/dashboard/friend-links',
    icon: LinkIcon,
  },
]

const NavItem = memo(({
  href,
  icon: Icon,
  title,
  isActive,
  onNavigate,
}: {
  href: string
  icon: React.ElementType
  title: string
  isActive: boolean
  onNavigate: (href: string) => void
}) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    onNavigate(href)
  }, [href, onNavigate])

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'transparent',
      )}
    >
      <Icon className="mr-2 h-4 w-4" />
      {title}
    </a>
  )
})

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [_isPending, startTransition] = useTransition()

  // 预加载相关路由
  const prefetchRoutes = useCallback(() => {
    navItems.forEach((item) => {
      router.prefetch(item.href)
    })
  }, [router])

  // 使用startTransition包装导航，避免阻塞UI
  const handleNavigate = useCallback((href: string) => {
    startTransition(() => {
      router.push(href)
    })
  }, [router])

  return (
    <nav
      className="hidden w-64 h-full flex-col bg-background md:flex"
      onMouseEnter={prefetchRoutes}
    >
      <div className="flex-center h-16 px-4">
        <Logo text="yume space" />
      </div>
      <div className="space-y-1 p-2">
        {navItems.map(item => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            title={item.title}
            isActive={pathname === item.href}
            onNavigate={handleNavigate}
          />
        ))}
      </div>
    </nav>
  )
}
