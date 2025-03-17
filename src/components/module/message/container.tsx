'use client'

import type { Comment } from '@prisma/client'
import { useOptimistic } from 'react'
import { MessageBoard } from './board'
import { MessageForm } from './form'

export default function MessageContainer({ initialMessages }: { initialMessages: Comment[] }) {
  const [optimisticMessages, setOptimisticMessages] = useOptimistic<Comment[]>(initialMessages)

  const handleDelete = (id: number) => {
    setOptimisticMessages(prevMessages => prevMessages.filter(msg => msg.id !== id))
  }

  return (
    <div className="space-y-10">
      <MessageForm setOptimisticMessages={setOptimisticMessages} />
      <MessageBoard messages={optimisticMessages} onDelete={handleDelete} />
    </div>
  )
}
