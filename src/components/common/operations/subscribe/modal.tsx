'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { useActionState, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { createSubscriber } from './action'

export function SubscribeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useUser()
  const email = user?.emailAddresses[0]?.emailAddress || ''

  const [state, formAction, isPending] = useActionState(createSubscriber, { message: '', success: false })

  useEffect(() => {
    if (state.success) {
      setIsOpen(false)
    }
    if (state.message) {
      toast[state.success ? 'success' : 'error'](state.message)
    }
  }, [state])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>订阅</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            订阅
          </DialogTitle>
          <DialogDescription>
            关注「yume」的最新内容
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex-center gap-6">
          <Input
            type="email"
            name="email"
            id="email"
            defaultValue={email}
          />
          <Button
            type="submit"
            disabled={isPending}
          >
            {isPending
              ? <Loader2 className="size-5 animate-spin" />
              : '订阅'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
