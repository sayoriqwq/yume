'use client'

import { useActionState, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
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
import { createSubscriber } from './action'

export function SubscribeModal() {
  const [isOpen, setIsOpen] = useState(false)

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
          />
          <Button
            type="submit"
            disabled={isPending}
          >
            {isPending
              ? <span aria-hidden className="i-mingcute-loading-3-line size-5 animate-spin" />
              : '订阅'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
