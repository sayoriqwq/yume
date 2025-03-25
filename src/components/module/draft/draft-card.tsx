'use client'

import { NormalTime } from '@/components/common/time'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface DraftCardProps {
  id: number
  title: string
  slug: string
  category: string
  description?: string
  cover?: string
  content: string
  viewCount: number
  published: boolean
  createdAt: Date
  updatedAt?: Date
  mode: 'scroll' | 'drag' | 'grid'
  className?: string
}

export function DraftCard({
  title,
  slug,
  category,
  description,
  cover,
  createdAt,
  mode,
  className,
}: DraftCardProps) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <motion.div
      className={
        cn(
          'flex w-72 flex-col gap-y-3 rounded-xl p-4 shadow-md',
          'group',
          'transition-all duration-300 hover:shadow-lg',
          {
            'flex-col-reverse bg-card': mode === 'scroll',
            'bg-card': mode === 'drag',
            'bg-card w-full': mode === 'grid',
          },
          className,
        )
      }
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      animate={{ scale: isPressed ? 1.05 : 1 }}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-muted">
        <Image
          src={cover || ''}
          alt={`Draft: ${title}`}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          draggable={false}
          onDragStart={e => e.preventDefault()}
        />
      </div>

      <div className="flex flex-col gap-y-3">
        <div className="flex-between">
          <Link href={`/posts/${category}/${slug}`}>
            <h3 className="line-clamp-1 text-lg font-bold text-foreground transition-colors duration-300 group-hover:text-primary group-hover:underline">
              {title}
            </h3>
          </Link>
          <NormalTime date={createdAt} className="text-sm text-muted-foreground" />
        </div>

        {description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-accent"></span>
            <span className="text-xs text-muted-foreground">{category}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
