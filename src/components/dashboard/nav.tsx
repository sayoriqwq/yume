'use client'

import { cn } from '@/lib/utils'
import {
  FileText,
  FolderTree,
  LayoutDashboard,
  Link as LinkIcon,
  MessageSquare,
  Settings,
  Tags,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
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
  {
    title: '订阅',
    href: '/dashboard/subscribers',
    icon: Users,
  },
  {
    title: '配置',
    href: '/dashboard/config',
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex h-16 items-center border-b px-4">
        <span className="text-xl font-bold">yume-space</span>
      </div>
      <div className="flex-1 space-y-1 p-2">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                pathname === item.href
                  ? 'bg-accent text-accent-foreground'
                  : 'transparent',
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
