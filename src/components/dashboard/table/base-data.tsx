import type { ApprovalStatus as ApprovalStatusType } from '@prisma/client'
import { CheckCircle, Circle, CircleOff } from 'lucide-react'

interface ApprovalStatus {
  value: ApprovalStatusType
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface PublishedStatus {
  value: boolean
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export const approvalStatus: ApprovalStatus[] = [
  {
    value: 'PENDING',
    label: 'Pending',
    icon: Circle,
  },
  {
    value: 'APPROVED',
    label: 'Approved',
    icon: CheckCircle,
  },
  {
    value: 'REJECTED',
    label: 'Rejected',
    icon: CircleOff,
  },
]

export const publishedStatus: PublishedStatus[] = [
  {
    value: true,
    label: 'Published',
    icon: CheckCircle,
  },
  {
    value: false,
    label: 'not_published',
    icon: CircleOff,
  },
]

export const labels = [
  {
    value: 'like',
    label: 'like',
  },
  {
    value: 'star',
    label: 'star',
  },
]
