'use client'

import type { OptimisticMessage } from '@/components/module/message/type'
import { RelativeTime } from '@/components/common/time'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { siteConfig } from '@/config/site'
import { useUser } from '@clerk/nextjs'
import { Loader2, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface Props {
  message: OptimisticMessage
  onDelete: (id: number) => void
}

export function MessageItem({ message, onDelete }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { user } = useUser()
  const author = message.author

  const confirmDelete = () => {
    onDelete(message.id)
    setIsDialogOpen(false)
  }

  return (
    <>
      <li key={message.id} className="">
        <div className="flex gap-3">
          <div className="flex shrink-0 flex-col items-center gap-2">
            <Image
              src={author?.image_url ?? siteConfig.avatar}
              width={40}
              height={40}
              alt="user image"
              className="rounded-full"
            />
          </div>

          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center gap-3">
              <p>{author?.username}</p>
              <RelativeTime date={message.createdAt} className="text-muted-foreground text-xs" />
            </div>

            <div className="flex items-center gap-3 relative">
              <p className="shadow-2xs bg-card relative w-fit break-words rounded-xl px-4 py-2">
                {message.content}
                {user?.id === message.authorId && (
                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className="absolute inset-0 flex-center backdrop-blur-[1px] bg-background/10 rounded-xl opacity-0 transition-opacity hover:opacity-100"
                    aria-label="删除消息"
                  >
                    <Trash2 className="text-foreground size-6 cursor-pointer" />
                  </button>
                )}
              </p>
              {message?.isSending && <Loader2 className="size-5 animate-spin" />}
            </div>
          </div>
        </div>
      </li>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除这条消息吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={confirmDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
