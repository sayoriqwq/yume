'use client'

import type { ArticlesResponse } from '@/app/api/articles/route'
import { Underline } from '@/components/common/tailwind-motion/underline'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import useSWR from 'swr'

export interface NoteListProps {
  activeNoteId: number
  className?: string
}

export function NoteList({ activeNoteId, className }: NoteListProps) {
  const { data } = useSWR<ArticlesResponse>('/api/articles?type=NOTE')

  const notes = data?.articles?.filter(note => note.published) ?? []

  if (notes.length === 0) {
    return (
      <div className="sticky top-2/5 ml-10 max-h-72 w-64">暂无随笔</div>
    )
  }

  return (
    <div className={cn('sticky top-2/5 ml-10 max-h-72 w-64', className)}>
      <h3 className="text-lg font-bold mb-4">所有随笔</h3>
      <ul className="space-y-2">
        {notes.map((note) => {
          const isActive = activeNoteId === note.id
          const noteUrl = `/notes/${note.id}`

          return (
            <li key={note.id}>
              <Link
                href={noteUrl}
                className={cn(
                  'block py-1.5 px-3 rounded-md transition-colors relative group w-full overflow-hidden text-ellipsis whitespace-nowrap',
                  isActive
                    ? 'text-accent font-medium'
                    : 'text-foreground hover:text-primary',
                )}
              >
                <span>{note.title}</span>
                {!isActive && <Underline />}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
