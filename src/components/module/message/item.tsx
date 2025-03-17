'use client'

import type { Message } from '@/components/module/message/type'
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
import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { deleteMessage } from './actions'

interface Props {
  message: Message & { isSending?: boolean }
  onDelete: (id: number) => void
}

export function MessageItem({ message, onDelete }: Props) {
  const [isPending, startTransition] = useTransition()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { user } = useUser()
  const author = message.author

  const confirmDelete = () => {
    startTransition(async () => {
      const result = await deleteMessage(message.id)
      if (result.success) {
        onDelete(message.id)
        toast.success(result.message)
      }
      else {
        toast.error(result.message)
      }
    })
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
                    disabled={isPending}
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
            <Button variant="destructive" onClick={confirmDelete} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
