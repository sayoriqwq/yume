'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ApprovalStatus } from '@/generated'
import { cn } from '@/lib/utils'
import { AlarmClock, AlertTriangle, Check, Loader2, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback, useState } from 'react'
import { useFriendLink } from './useFriendLink'

// 删除确认模态框组件
function DeleteConfirmModal({
  friendLink,
  onConfirm,
  onCancel,
}: {
  friendLink: {
    id: number
    nickname: string
    siteName: string
  }
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4 text-amber-500">
        <AlertTriangle className="h-6 w-6" />
        <h3 className="text-lg font-semibold">确认删除</h3>
      </div>

      <p className="mb-2 text-gray-700">
        您确定要删除以下友链吗？此操作不可撤销。
      </p>

      <div className="p-3 mb-4 bg-gray-50 rounded-md">
        <p className="font-medium">{friendLink.nickname}</p>
        <p className="text-sm text-gray-500">{friendLink.siteName}</p>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          确认删除
        </Button>
      </div>
    </div>
  )
}

export default function FriendLinksPage() {
  const [status, setStatus] = useState<ApprovalStatus | 'ALL'>('ALL')
  const {
    friendLinks,
    isLoading,
    isUpdating,
    isRemoving,
    updateFriendLink,
    removeFriendLink,
  } = useFriendLink(status === 'ALL' ? undefined : status)

  const { present } = useModalStack()

  const handleStatusChange = (value: string) => {
    setStatus(value as ApprovalStatus | 'ALL')
  }

  const handleApprove = (id: number) => {
    updateFriendLink(id, { status: ApprovalStatus.APPROVED })
  }

  const handleReject = (id: number) => {
    updateFriendLink(id, { status: ApprovalStatus.REJECTED })
  }

  const handlePending = (id: number) => {
    updateFriendLink(id, { status: ApprovalStatus.PENDING })
  }

  const handleDelete = useCallback((friendLink: {
    id: number
    nickname: string
    siteName: string
  }) => {
    present({
      title: '删除友链',
      content: ({ dismiss }) => (
        <DeleteConfirmModal
          friendLink={friendLink}
          onConfirm={() => {
            removeFriendLink(friendLink.id)
            dismiss()
          }}
          onCancel={() => dismiss()}
        />
      ),
    })
  }, [present, removeFriendLink])

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">友链管理</h1>
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="筛选状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">全部</SelectItem>
            <SelectItem value={ApprovalStatus.PENDING}>待审核</SelectItem>
            <SelectItem value={ApprovalStatus.APPROVED}>已批准</SelectItem>
            <SelectItem value={ApprovalStatus.REJECTED}>已拒绝</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading
        ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )
        : friendLinks.length === 0
          ? (
              <div className="flex h-40 items-center justify-center">
                <p className="text-gray-500">没有找到符合条件的友链</p>
              </div>
            )
          : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {friendLinks.map(friendLink => (
                  <FriendLinkCard
                    key={friendLink.id}
                    friendLink={friendLink}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onPending={handlePending}
                    onDelete={handleDelete}
                    isUpdating={isUpdating}
                    isRemoving={isRemoving}
                  />
                ))}
              </div>
            )}
    </div>
  )
}

interface FriendLinkCardProps {
  friendLink: {
    id: number
    nickname: string
    siteName: string
    link: string
    description: string
    avatar: string
    status: ApprovalStatus
  }
  onApprove: (id: number) => void
  onReject: (id: number) => void
  onPending: (id: number) => void
  onDelete: (friendLink: { id: number, nickname: string, siteName: string }) => void
  isUpdating: boolean
  isRemoving: boolean
}

function FriendLinkCard({
  friendLink,
  onApprove,
  onReject,
  onPending,
  onDelete,
  isUpdating,
  isRemoving,
}: FriendLinkCardProps) {
  const { id, nickname, siteName, link, description, avatar, status } = friendLink

  const statusBadgeClasses = cn(
    'px-2 py-1 text-xs font-medium rounded-full',
    {
      'bg-yellow-100 text-yellow-800': status === ApprovalStatus.PENDING,
      'bg-green-100 text-green-800': status === ApprovalStatus.APPROVED,
      'bg-red-100 text-red-800': status === ApprovalStatus.REJECTED,
    },
  )

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="flex p-4">
        <Avatar className="size-16 mr-4">
          <AvatarImage src={avatar} alt="头像" />
          <AvatarFallback>{nickname}</AvatarFallback>
        </Avatar>
        <div className="flex-grow relative">
          <div className="absolute right-4 top-4">
            <span className={statusBadgeClasses}>
              {status === ApprovalStatus.PENDING && '待审核'}
              {status === ApprovalStatus.APPROVED && '已批准'}
              {status === ApprovalStatus.REJECTED && '已拒绝'}
            </span>
          </div>
          <div className="mb-2 text-lg font-semibold">{nickname}</div>
          <div className="mb-1 text-sm text-gray-600">{siteName}</div>
          <Link
            href={link}
            target="_blank"
            className="mb-3 block truncate text-sm text-blue-500 hover:underline"
          >
            {link}
          </Link>
          <p className="mb-4 line-clamp-2 text-sm text-gray-500">{description}</p>
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => onApprove(id)}
              disabled={isUpdating}
            >
              {isUpdating && status === ApprovalStatus.APPROVED ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onReject(id)}
              disabled={isUpdating}
            >
              {isUpdating && status === ApprovalStatus.REJECTED ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
              onClick={() => onPending(id)}
              disabled={isUpdating}
            >
              {isUpdating && status === ApprovalStatus.PENDING ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlarmClock className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-slate-600 hover:text-slate-700 hover:bg-slate-50"
              onClick={() => onDelete({ id, nickname, siteName })}
              disabled={isRemoving}
            >
              {isRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
