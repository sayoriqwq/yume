'use client'

import type { ApprovalStatus } from '@/generated'
import { useCommentReplies, useCommentsData } from '@/atoms/dashboard/hooks/useComment'
import { NormalTime } from '@/components/common/time'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  ArrowUpCircle,
  Edit,
  ExternalLink,
  MessageCircle,
  Save,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback, useState } from 'react'

function StatusBadge({ status }: { status: ApprovalStatus }) {
  switch (status) {
    case 'PENDING':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">待审核</Badge>
    case 'APPROVED':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">已批准</Badge>
    case 'REJECTED':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">已拒绝</Badge>
    default:
      return null
  }
}

export function CommentDetail({ id }: { id: number }) {
  const { commentMap, updateComment } = useCommentsData()
  const { replies } = useCommentReplies(id)
  const [isEditing, setIsEditing] = useState(false)
  const [editingContent, setEditingContent] = useState('')

  const comment = commentMap[id]

  const { present } = useModalStack()
  const showReplyDetail = useCallback((replyId: number) => {
    const reply = commentMap[replyId]
    if (!reply)
      return

    const modalId = `comment-${replyId}`
    present({
      id: modalId,
      title: `回复详情 #${replyId}`,
      content: () => <CommentDetail id={replyId} />,
    })
  }, [commentMap, present])

  if (!comment) {
    return <div>评论不存在</div>
  }

  const handleStartEditing = () => {
    setEditingContent(comment.content)
    setIsEditing(true)
  }

  const handleSave = () => {
    updateComment(id, { content: editingContent })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleDelete = () => {
    updateComment(id, { deleted: true })
  }

  const handleRestore = () => {
    updateComment(id, { deleted: false })
  }

  return (
    <div className="space-y-6 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={comment.author?.image_url || ''} alt={comment.author?.username || '匿名'} />
            <AvatarFallback>{(comment.author?.username?.[0] || '?').toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.author?.username || '匿名'}</span>
              <StatusBadge status={comment.status as ApprovalStatus} />
              {comment.deleted && (
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">已删除</Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              <NormalTime date={comment.createdAt} />
            </div>
          </div>
        </div>

        <div className="flex gap-2 ml-8">
          {comment.deleted
            ? (
          // 已删除评论显示恢复按钮
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={handleRestore}
                >
                  <ArrowUpCircle className="h-4 w-4 mr-1" />
                  恢复
                </Button>
              )
            : (
                <>
                  {isEditing
                    ? (
                        <>
                          <Button variant="outline" size="sm" onClick={handleCancel}>
                            取消
                          </Button>
                          <Button variant="default" size="sm" onClick={handleSave}>
                            <Save className="h-4 w-4 mr-1" />
                            保存
                          </Button>
                        </>
                      )
                    : (
                        <>
                          <Button variant="outline" size="sm" onClick={handleStartEditing}>
                            <Edit className="h-4 w-4 mr-1" />
                            编辑
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={handleDelete}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            删除
                          </Button>
                        </>
                      )}
                </>
              )}
        </div>
      </div>

      {comment.article && (
        <div className="flex items-center text-sm bg-muted/20 p-2 rounded">
          <ArrowLeft className="h-3 w-3 mr-1" />
          <span className="text-muted-foreground mr-2">评论于：</span>
          <div className="flex items-center">
            <Link
              href={`/dashboard/articles/${comment.article.id}`}
              className="font-medium text-primary hover:underline"
            >
              {comment.article.title}
            </Link>
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" asChild>
              <Link href={`/blog/${comment.article.slug}`} target="_blank">
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {comment.parentId && comment.parent && (
        <div className="text-sm bg-muted/30 p-3 rounded-md border border-muted">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-muted-foreground">回复：</span>
            {comment.parent.author
              ? (
                  <span className="font-medium">{comment.parent.author.username}</span>
                )
              : (
                  <span className="text-muted-foreground">匿名用户</span>
                )}
          </div>
          <p className="text-muted-foreground italic line-clamp-2">{comment.parent.content}</p>
        </div>
      )}

      <div className={`min-h-[100px] ${comment.deleted ? 'opacity-50' : ''}`}>
        {isEditing
          ? (
              <Textarea
                value={editingContent}
                onChange={e => setEditingContent(e.target.value)}
                className="min-h-[100px]"
              />
            )
          : (
              <div className={`prose dark:prose-invert max-w-none p-3 rounded-md ${comment.deleted ? 'bg-muted/20' : 'bg-background'}`}>
                {comment.deleted
                  ? (
                      <p className="text-muted-foreground italic">{comment.content}</p>
                    )
                  : (
                      comment.content
                    )}
              </div>
            )}
      </div>

      {replies.length > 0 && (
        <>
          <Separator />
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <h3 className="font-medium">
                回复 (
                {replies.length}
                )
              </h3>
            </div>

            <div className="space-y-4">
              {replies.map(reply => (
                <Card
                  key={reply.id}
                  className={`p-4 ${reply.deleted ? 'bg-muted/20 border-dashed' : ''} hover:border-primary transition-colors cursor-pointer`}
                  onClick={() => showReplyDetail(reply.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={reply.author?.image_url || ''} alt={reply.author?.username || '匿名'} />
                        <AvatarFallback>{(reply.author?.username?.[0] || '?').toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{reply.author?.username || '匿名'}</span>
                      <span className="text-xs text-muted-foreground">
                        <NormalTime date={reply.createdAt} />
                      </span>
                      <StatusBadge status={reply.status as ApprovalStatus} />
                      {reply.deleted && (
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">已删除</Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-primary">
                      查看详情
                    </Button>
                  </div>
                  <p className={`text-sm ${reply.deleted ? 'text-muted-foreground italic' : ''}`}>
                    {reply.content}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
