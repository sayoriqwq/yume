import type { Comment } from '@prisma/client'

import { MessageItem } from './item'

export function MessageBoard({ messages, onDelete }: { messages: (Comment & { isLoading?: boolean })[], onDelete: (id: number) => void }) {
  return (
    <ul className="flex flex-col space-y-4">
      {messages.map(message => (
        <MessageItem key={message.id} message={message} onDelete={onDelete} />
      ))}
    </ul>
  )
}
