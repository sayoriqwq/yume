'use client'

import type { CommentWithAuthor } from '@/types/comment'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { errorLogger, errorToaster } from '@/lib/error-handler'
import { useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { use, useOptimistic, useRef, useState, useTransition } from 'react'
import { toast } from 'react-hot-toast'
import { createComment, deleteComment } from './actions'
import { CommentItem } from './comment-item'

type CommentAction =
  | { type: 'add', comment: CommentWithAuthor }
  | { type: 'delete', id: number }
  | { type: 'set', comments: CommentWithAuthor[] }

export function CommentContainer({ articleId, commentsPromise, commentCountPromise }: {
  articleId: number
  commentsPromise: Promise<CommentWithAuthor[]>
  commentCountPromise: Promise<number>
}) {
  const initialComments = use(commentsPromise)
  const initialCount = use(commentCountPromise)
  const { user, isLoaded } = useUser()
  const path = usePathname()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()

  // 使用optimistic更新评论
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    initialComments,
    (state, action: CommentAction) => {
      switch (action.type) {
        case 'add':
          // 如果是回复，添加到对应的父评论中
          if (action.comment.parentId) {
            return state.map((comment) => {
              if (comment.id === action.comment.parentId) {
                return {
                  ...comment,
                  replies: [action.comment, ...(comment.replies || [])],
                }
              }
              // 递归检查子评论
              if (comment.replies?.length) {
                return {
                  ...comment,
                  replies: comment.replies.map(reply =>
                    reply.id === action.comment.parentId
                      ? { ...reply, replies: [action.comment, ...(reply.replies || [])] }
                      : reply,
                  ),
                }
              }
              return comment
            })
          }
          // 否则添加到顶层评论
          return [action.comment, ...state]

        case 'delete':
        // 递归过滤掉被删除的评论
        { const filterDeleted = (comments: CommentWithAuthor[]): CommentWithAuthor[] => {
          return comments.filter((c) => {
            if (c.id === action.id)
              return false
            if (c.replies?.length) {
              c.replies = filterDeleted(c.replies)
            }
            return true
          })
        }
        return filterDeleted(state) }

        case 'set':
          // 直接设置评论列表
          return action.comments
      }
    },
  )

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleSubmit() {
    if (!content.trim() || !isLoaded || !user || !articleId)
      return

    // 创建临时评论对象
    const optimisticComment: CommentWithAuthor = {
      id: Math.floor(Math.random() * -1000000), // 临时负ID
      content,
      articleId,
      parentId: null,
      status: 'APPROVED',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: user.id,
      author: {
        id: user.id,
        username: user.username || user.firstName || '用户',
        image_url: user.imageUrl,
      },
      replies: [],
      deleted: false,
    }

    // 执行服务器操作
    startTransition(async () => {
      // 乐观更新UI
      addOptimisticComment({ type: 'add', comment: optimisticComment })
      try {
        const result = await createComment(content, articleId, null, path)
        if (result.success) {
          toast.success('评论发表成功')
          setContent('')
        }
      }
      catch (error) {
        errorLogger(error)
        errorToaster(error)
      }
    })
  }

  const handleReply = async (content: string, parentId: number) => {
    if (!content.trim() || !user || !articleId)
      return

    // 创建临时回复评论对象
    const optimisticReply: CommentWithAuthor = {
      id: Math.floor(Math.random() * -1000000), // 临时负ID
      content,
      articleId,
      parentId,
      status: 'APPROVED',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: user.id,
      author: {
        id: user.id,
        username: user.username || user.firstName || '用户',
        image_url: user.imageUrl,
      },
      replies: [],
      deleted: false,
    }

    // 执行服务器操作
    startTransition(async () => {
      // 乐观更新UI
      addOptimisticComment({ type: 'add', comment: optimisticReply })
      try {
        const result = await createComment(content, articleId, parentId, path)
        if (result.success) {
          toast.success('评论发表成功')
          setContent('')
        }
      }
      catch (error) {
        errorLogger(error)
        errorToaster(error)
      }
    })
  }

  const handleDelete = async (commentId: number) => {
    // 执行服务器操作
    startTransition(async () => {
      // 乐观更新UI
      addOptimisticComment({ type: 'delete', id: commentId })
      try {
        const res = await deleteComment(commentId, path)
        if (res.success) {
          toast.success('评论删除成功')
          setContent('')
        }
      }
      catch (error) {
        errorLogger(error)
        errorToaster(error)
      }
    })
  }

  return (
    <div className="space-y-8 mt-10">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold">评论</h2>
        <span className="text-muted-foreground">
          (
          {initialCount}
          )
        </span>
      </div>

      {user
        ? (
            <div className="space-y-4">
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="写下你的评论... ( cmd + Enter 发送 )"
                onKeyDown={handleKeyDown}
                maxLength={500}
                className="min-h-[100px]"
                disabled={isPending}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isPending}
                >
                  {isPending ? '发送中...' : '发表评论'}
                </Button>
              </div>
            </div>
          )
        : (
            <div className="flex-center p-6 rounded-xl border border-dashed bg-card">
              <p className="text-card-foreground">登录后发表评论</p>
            </div>
          )}

      <ul className="flex flex-col space-y-6">
        {optimisticComments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={handleDelete}
            onReply={handleReply}
            isProcessing={isPending && comment.id < 0} // 针对临时评论显示加载状态
          />
        ))}
      </ul>
    </div>
  )
}
