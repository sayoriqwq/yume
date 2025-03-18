'use client'

import type { CommentWithAuthor } from './types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useUser } from '@clerk/nextjs'
import { useRef, useState } from 'react'
import { CommentItem } from './comment-item'
import { useComments } from './hooks'

interface Props {
  articleId: number
}

export function CommentContainer({ articleId }: Props) {
  const { user } = useUser()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [content, setContent] = useState('')
  const { comments, createComment, deleteComment } = useComments(articleId)

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleSubmit() {
    if (!content.trim() || !user)
      return

    createComment(content)
    setContent('')
    textareaRef.current?.focus()
  }

  // 构建评论树
  const buildCommentTree = (comments: CommentWithAuthor[]) => {
    const commentMap = new Map<number, CommentWithAuthor & { replies: CommentWithAuthor[] }>()

    // 创建所有评论节点
    comments.forEach((comment) => {
      commentMap.set(comment.id, {
        ...comment,
        replies: [],
      })
    })

    const rootComments: (CommentWithAuthor & { replies: CommentWithAuthor[] })[] = []

    comments.forEach((comment) => {
      const commentNode = commentMap.get(comment.id)!

      if (!comment.parentId) {
        // 根评论
        rootComments.push(commentNode)
      }
      else {
        // 回复
        const parentNode = commentMap.get(comment.parentId)
        if (parentNode) {
          parentNode.replies.push(commentNode)
        }
      }
    })

    // 按时间排序
    const sortComments = (comments: (CommentWithAuthor & { replies: CommentWithAuthor[] })[]) => {
      comments.sort((a, b) => {
        const dateA = new Date(a.createdAt)
        const dateB = new Date(b.createdAt)
        return dateB.getTime() - dateA.getTime()
      })
      comments.forEach((comment) => {
        if (comment.replies.length > 0) {
          sortComments(comment.replies)
        }
      })
    }

    sortComments(rootComments)
    return rootComments
  }

  const commentTree = buildCommentTree(comments)

  return (
    <div className="space-y-8 mt-10">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold">评论</h2>
        <span className="text-muted-foreground">
          (
          {comments.length}
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
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!content.trim()}
                >
                  发表评论
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
        {commentTree.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={deleteComment}
            onReply={(content, parentId) => createComment(content, parentId)}
          />
        ))}
      </ul>
    </div>
  )
}
