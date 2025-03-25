'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { siteConfig } from '@/config/site'
import { CheckCircle2, Circle } from 'lucide-react'
import Link from 'next/link'

interface TodoItem {
  text: string
  completed: boolean
}

const recentTodos: TodoItem[] = [
  { text: '完成个人网站的设计稿', completed: true },
  { text: '学习React Server Components', completed: true },
  { text: '实现各个模块', completed: false },
  { text: '优化网站加载性能', completed: false },
  { text: '编写新的博客文章', completed: false },
]

export function RecentActivity() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/about">
          <Avatar className="size-16 transition duration-300 ring-2 ring-muted hover:ring-accent">
            <AvatarImage src={siteConfig.avatar} />
            <AvatarFallback>Ciallo~</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <h3 className="text-lg font-heading">最近在做什么</h3>
          <p className="text-sm text-muted-foreground">My recent activities</p>
        </div>
      </div>

      <ul className="space-y-3 max-h-80 overflow-auto">
        {recentTodos.map((todo, index) => (
          <li
            key={index}
            className={`
                flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                ${todo.completed ? 'bg-muted/50' : 'bg-card hover:bg-muted/30 hover:shadow-sm'}
              `}
          >
            {todo.completed
              ? (
                  <CheckCircle2 className="size-5 text-accent flex-shrink-0" />
                )
              : (
                  <Circle className="size-5 text-muted-foreground flex-shrink-0" />
                )}
            <span className={`${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
