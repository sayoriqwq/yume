'use client'

import type { CommentFormData, CommentStatus, CommentWithAuthor } from '@/types/comment'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { errorLogger, errorToaster } from '@/lib/error-handler'
import { createYumeError, YumeErrorType } from '@/lib/YumeError'
import { useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback, useRef, useState, useTransition } from 'react'
import { toast } from 'react-hot-toast'
import useSWR from 'swr'
import { createComment, deleteComment, getCommentStatus } from './actions'
import { CommentItem } from './comment-item'

interface CommentsProps {
  articleId: number
  initialComments: CommentWithAuthor[]
  initialCount: number
}

export function Comments({ articleId, initialComments = [], initialCount = 0 }: CommentsProps) {
  const { user } = useUser()
  const path = usePathname()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()
  const { dismissTop } = useModalStack()

  // 使用预加载数据作为fallbackData
  const { data, mutate } = useSWR<CommentStatus>(
    ['comments', articleId],
    () => getCommentStatus(articleId),
    {
      fallbackData: [initialComments, initialCount],
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  )

  const [comments, commentCount] = data || [[], 0]

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleSubmit() {
    if (!content.trim() || !user || !articleId)
      return

    // 创建临时评论对象
    const optimisticComment: CommentWithAuthor = {
      id: Math.floor(Math.random() * -1000000),
      content,
      articleId,
      parentId: null,
      status: 'APPROVED',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: user.id,
      author: {
        id: user.id,
        username: user.username || user.firstName || '神秘',
        image_url: user.imageUrl,
      },
      likes: [],
      likeCount: 0,
      hasLiked: false,
      replies: [],
      deleted: false,
    }

    // 准备乐观更新的数据
    const optimisticData: CommentStatus = [
      [optimisticComment, ...comments],
      commentCount + 1,
    ]

    startTransition(async () => {
      // 使用SWR的乐观更新功能
      mutate(async () => {
        try {
          // 提交评论
          await createComment({
            articleId,
            content,
            parentId: null,
            path,
            userId: user.id,
          })

          // 成功后清空输入
          setContent('')
          toast.success('评论发表成功')

          // 获取更新后的评论数据
          return getCommentStatus(articleId)
        }
        catch (error) {
          errorLogger(error)
          errorToaster(error)
          // 发生错误时，返回修改前的数据以还原UI
          return data
        }
      }, {
        optimisticData, // 立即更新UI的临时数据
        rollbackOnError: true, // 出错时回滚UI
      })
    })
  }

  const handleReply = async (content: string, parentId: number) => {
    if (!content.trim() || !user || !articleId)
      return

    // 创建临时回复评论
    const optimisticReply: CommentWithAuthor = {
      id: Math.floor(Math.random() * -1000000),
      content,
      articleId,
      parentId,
      status: 'APPROVED',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: user.id,
      author: {
        id: user.id,
        username: user.username || user.firstName || '神秘',
        image_url: user.imageUrl,
      },
      likes: [],
      likeCount: 0,
      hasLiked: false,
      replies: [],
      deleted: false,
    }

    // 准备乐观更新数据 - 添加回复到对应父评论
    const optimisticData: CommentStatus = [
      comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [optimisticReply, ...(comment.replies || [])],
          }
        }
        // 检查子评论
        if (comment.replies?.length) {
          return {
            ...comment,
            replies: comment.replies.map(reply =>
              reply.id === parentId
                ? { ...reply, replies: [optimisticReply, ...(reply.replies || [])] }
                : reply,
            ),
          }
        }
        return comment
      }),
      commentCount + 1,
    ]

    startTransition(async () => {
      mutate(async () => {
        try {
          const formData: CommentFormData = {
            content,
            articleId,
            parentId,
          }

          await createComment({
            ...formData,
            path,
            userId: user.id,
          })

          toast.success('回复成功')
          return getCommentStatus(articleId)
        }
        catch (error) {
          errorLogger(error)
          errorToaster(error)
          return data
        }
      }, { optimisticData, rollbackOnError: true })
    })
  }

  const handleDelete = async (commentId: number) => {
    // 准备乐观更新数据 - 移除被删除的评论
    const filterDeleted = (comments: CommentWithAuthor[]): CommentWithAuthor[] => {
      return comments.filter((c) => {
        if (c.id === commentId)
          return false
        if (c.replies?.length) {
          c.replies = filterDeleted(c.replies)
        }
        return true
      })
    }

    const optimisticData: CommentStatus = [
      filterDeleted([...comments]),
      commentCount - 1,
    ]

    dismissTop()
    startTransition(async () => {
      mutate(async () => {
        try {
          if (!user) {
            throw createYumeError(new Error('用户信息获取失败'), YumeErrorType.UnauthorizedError)
          }
          await deleteComment({ id: commentId, path, userId: user.id })
          toast.success('评论删除成功')
          return getCommentStatus(articleId)
        }
        catch (error) {
          errorLogger(error)
          errorToaster(error)
          return data
        }
      }, { optimisticData, rollbackOnError: true })
    })
  }

  // 处理评论点赞状态更新
  const handleCommentLike = useCallback((commentId: number, liked: boolean) => {
    // 更新内存中评论的点赞状态（乐观更新）
    const updateCommentsLikeState = (comments: CommentWithAuthor[]): CommentWithAuthor[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            hasLiked: liked,
            likeCount: liked
              ? (comment.likeCount || 0) + 1
              : Math.max((comment.likeCount || 0) - 1, 0),
          }
        }

        // 递归处理嵌套评论
        if (comment.replies?.length) {
          return {
            ...comment,
            replies: updateCommentsLikeState(comment.replies),
          }
        }

        return comment
      })
    }

    // 使用SWR的乐观更新
    const [currentComments] = data || [[], 0]
    const updatedComments = updateCommentsLikeState([...currentComments])

    mutate([updatedComments, commentCount], false) // 不重新获取数据
  }, [data, commentCount, mutate])

  if (!user) {
    return (
      <div className="flex-center p-6 rounded-xl border border-dashed bg-card">
        <p className="text-card-foreground">登录后发表评论</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 mt-10">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold">评论</h2>
        <span className="text-muted-foreground">
          (
          {commentCount}
          )
        </span>
      </div>

      {/* 评论输入框 */}
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

      {/* 评论列表 */}
      <ul className="flex flex-col space-y-6">
        {comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={handleDelete}
            onReply={handleReply}
            onLike={handleCommentLike}
            isProcessing={isPending && comment.id < 0}
          />
        ))}
      </ul>
    </div>
  )
}
