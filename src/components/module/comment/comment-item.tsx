'use client'

import type { CommentWithAuthor } from '@/types/comment'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useModalStack } from 'rc-modal-sheet'
import { memo, useCallback, useState, useTransition } from 'react'
import { toast } from 'react-hot-toast'
import { toggleLike } from '@/components/common/operations/like/action'
// 导入点赞组件和类型
import { RelativeTime } from '@/components/common/time'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { LikeableType } from '@/types'

interface Props {
  comment: CommentWithAuthor
  onDelete: (id: number) => void
  onReply: (content: string, parentId: number) => Promise<void>
  onLike?: (commentId: number, liked: boolean) => void
  isProcessing?: boolean
}

export const CommentItem = memo(function CommentItem({ comment, onDelete, onReply, onLike, isProcessing = false }: Props) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const { user } = useUser()
  const author = comment.author
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  // 获取评论的点赞信息
  const likeCount = comment.likeCount || 0
  const isLiked = comment.hasLiked || false

  const handleReply = async () => {
    if (!replyContent.trim())
      return
    await onReply(replyContent, comment.id)
    setReplyContent('')
    setIsReplying(false)
  }

  const handleLike = () => {
    if (!user) {
      toast.error('请先登录后再点赞')
      return
    }

    startTransition(async () => {
      try {
        // 调用点赞API
        const res = await toggleLike({
          targetId: comment.id,
          type: LikeableType.COMMENT,
          path: pathname,
          userId: user.id,
        })

        // 更新本地状态通过回调
        if (res.success && onLike) {
          onLike(comment.id, res.liked || false)
        }
      }
      catch (error) {
        console.error('点赞失败:', error)
      }
    })
  }

  const { present } = useModalStack()

  const showDeleteModal = useCallback(() => {
    present({
      title: `删除评论`,
      content: props => (
        <div className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground">确定要删除这条评论吗？</p>
          <div className="flex gap-2 mt-4">
            <Button variant="ghost" size="sm" onClick={props.dismiss}>取消</Button>
            <Button size="sm" onClick={() => onDelete(comment.id)}>删除</Button>
          </div>
        </div>
      ),
    })
  }, [comment.id, onDelete, present])

  return (
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
            {isProcessing && <span className="text-xs text-muted-foreground">(发送中...)</span>}
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="bg-muted/50 rounded-lg px-4 py-2">
                {comment.content}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={handleLike}
                  disabled={isPending}
                  className={cn(
                    'flex items-center gap-1.5 text-muted-foreground hover:text-rose-500 transition-colors',
                    isLiked && 'text-rose-500',
                    isPending && 'opacity-80',
                  )}
                  aria-label={isLiked ? '取消点赞' : '点赞'}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'size-4',
                      isLiked ? 'i-mingcute-heart-fill' : 'i-mingcute-heart-line',
                    )}
                  />
                  <span className={cn(
                    'text-sm font-medium',
                  )}
                  >
                    {likeCount > 0 ? likeCount : ''}
                  </span>
                </button>

                {user?.id === comment.authorId && (
                  <button
                    onClick={showDeleteModal}
                    className="text-muted-foreground hover:text-foreground text-sm"
                    disabled={isProcessing}
                  >
                    删除
                  </button>
                )}
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-muted-foreground hover:text-foreground text-sm"
                  disabled={isProcessing}
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
                  disabled={!replyContent.trim() || isProcessing}
                >
                  回复
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <ul className="ml-12 space-y-4 border-l-2 border-muted pl-4">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onDelete={onDelete}
              onReply={onReply}
              onLike={onLike}
              isProcessing={isProcessing && reply.id < 0}
            />
          ))}
        </ul>
      )}
    </li>
  )
})
