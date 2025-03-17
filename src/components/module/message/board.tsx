import type { Message } from './type'
import { MessageItem } from './item'

export function MessageBoard({ messages, onDelete }: { messages: (Message & { isLoading?: boolean })[], onDelete: (id: number) => void }) {
  return (
    <ul className="flex flex-col space-y-4">
      {messages.map(message => (
        <MessageItem key={message.id} message={message} onDelete={onDelete} />
      ))}
    </ul>
  )
}
