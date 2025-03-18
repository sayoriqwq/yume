import type { Comment, User } from '@prisma/client'

export type Message = Comment & {
  author: Partial<User>
}

export type OptimisticMessage = Message & {
  isSending?: boolean
}

export interface MessageState {
  success: boolean
  message: string
}
