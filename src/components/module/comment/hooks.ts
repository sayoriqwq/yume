import type { CommentWithAuthor } from './types'
import { useUser } from '@clerk/nextjs'
import { useCallback } from 'react'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import { createComment, deleteComment } from './actions'

async function fetcher(url: string): Promise<CommentWithAuthor[]> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('获取评论失败')
  }
  return response.json()
}

export function useComments(articleId: number) {
  const { user } = useUser()
  const { data: comments = [], mutate } = useSWR<CommentWithAuthor[]>(
    `/api/comments/${articleId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  const handleCreateComment = useCallback(async (content: string, parentId: number | null = null) => {
    if (!user)
      return

    try {
      const optimisticData: CommentWithAuthor = {
        id: Date.now(),
        content,
        authorId: user.id,
        articleId,
        parentId,
        status: 'APPROVED',
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: user.id,
          username: user.username || user.firstName || '未知用户',
          email: user.emailAddresses[0]?.emailAddress || '',
          image_url: user.imageUrl,
        },
        replies: [],
      }

      // 如果是回复，将新评论添加到父评论的 replies 中
      if (parentId) {
        await mutate(
          async (currentComments = []) => {
            const updateComment = (comments: CommentWithAuthor[]): CommentWithAuthor[] => {
              return comments.map((comment) => {
                if (comment.id === parentId) {
                  return {
                    ...comment,
                    replies: [...(comment.replies || []), optimisticData],
                  }
                }
                if (comment.replies?.length) {
                  return {
                    ...comment,
                    replies: updateComment(comment.replies),
                  }
                }
                return comment
              })
            }
            return updateComment(currentComments)
          },
          { revalidate: false },
        )
      }
      else {
        await mutate(
          async (currentComments = []) => {
            return [optimisticData, ...currentComments]
          },
          { revalidate: false },
        )
      }

      const result = await createComment({
        content,
        articleId,
        parentId,
      })

      if (!result.success) {
        throw new Error(result.message)
      }

      toast.success(result.message)
      await mutate()
    }
    catch (error) {
      await mutate()
      toast.error(error instanceof Error ? error.message : '发表评论失败')
    }
  }, [articleId, mutate, user])

  const handleDeleteComment = useCallback(async (commentId: number) => {
    try {
      const getCommentIds = (comment: CommentWithAuthor): number[] => {
        const ids = [comment.id]
        if (comment.replies?.length) {
          comment.replies.forEach((reply) => {
            ids.push(...getCommentIds(reply))
          })
        }
        return ids
      }

      const commentToDelete = comments.find(c => c.id === commentId)
      if (!commentToDelete)
        return

      const commentIds = getCommentIds(commentToDelete)

      await mutate(
        async (currentComments = []) => {
          const filterComments = (comments: CommentWithAuthor[]): CommentWithAuthor[] => {
            return comments.filter((comment) => {
              if (commentIds.includes(comment.id)) {
                return false
              }
              if (comment.replies?.length) {
                comment.replies = filterComments(comment.replies)
              }
              return true
            })
          }
          return filterComments(currentComments)
        },
        { revalidate: false },
      )

      const result = await deleteComment({ id: commentId })

      if (!result.success) {
        // 如果删除失败，恢复原始数据
        await mutate()
        toast.error(result.message)
      }
      else {
        toast.success(result.message)
      }
    }
    catch (error) {
      console.error('删除评论失败:', error)
      toast.error('删除评论失败')
      // 恢复原始数据
      await mutate()
    }
  }, [comments, mutate])

  return {
    comments,
    createComment: handleCreateComment,
    deleteComment: handleDeleteComment,
  }
}
