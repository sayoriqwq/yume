import type { Comment, User } from '@prisma/client'

export type Message = Comment & {
  author: Partial<User>
}
