'use client'

import type { CommentWithAuthor } from './types'
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
import { Textarea } from '@/components/ui/textarea'
import { siteConfig } from '@/config/site'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useState } from 'react'

interface Props {
  comment: CommentWithAuthor
  onDelete: (id: number) => void
  onReply: (content: string, parentId: number) => Promise<void>
}

export function CommentItem({ comment, onDelete, onReply }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const { user } = useUser()
  const author = comment.author

  const confirmDelete = () => {
    onDelete(comment.id)
    setIsDialogOpen(false)
  }

  const handleReply = async () => {
    if (!replyContent.trim())
      return
    await onReply(replyContent, comment.id)
    setReplyContent('')
    setIsReplying(false)
  }

  return (
    <>
      <li key={comment.id} className="space-y-4">
        <div className="flex gap-3">
          <div className="flex shrink-0 flex-col items-center gap-2">
            <Image
              src={author?.image_url || siteConfig.avatar}
              width={40}
              height={40}
              alt="user image"
              className="rounded-full"
            />
          </div>

          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center gap-3">
              <p className="font-medium">{author?.username || '未知用户'}</p>
              <RelativeTime date={comment.createdAt} className="text-muted-foreground text-xs" />
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="bg-muted/50 rounded-lg px-4 py-2">
                  {comment.content}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {user?.id === comment.authorId && (
                    <button
                      onClick={() => setIsDialogOpen(true)}
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      删除
                    </button>
                  )}
                  <button
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    回复
                  </button>
                </div>
              </div>
            </div>

            {isReplying && (
              <div className="mt-2 space-y-2">
                <Textarea
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  placeholder="写下你的回复..."
                  className="min-h-[80px]"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsReplying(false)}
                  >
                    取消
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={!replyContent.trim()}
                  >
                    回复
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {comment.replies.length > 0 && (
          <ul className="ml-12 space-y-4 border-l-2 border-muted pl-4">
            {comment.replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onDelete={onDelete}
                onReply={onReply}
              />
            ))}
          </ul>
        )}
      </li>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除这条评论吗？此操作无法撤销。
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
