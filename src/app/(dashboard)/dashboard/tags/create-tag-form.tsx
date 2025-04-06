'use client'

import type * as z from 'zod'
import { createTagSchema } from '@/app/api/admin/tags/schema'
import { useTagsData } from '@/atoms/dashboard/hooks/useTag'
import { useCommandSheet } from '@/components/common/command-sheet'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

type FormValues = z.infer<typeof createTagSchema>

export function CreateTagForm() {
  const { createTag } = useTagsData()
  const { close } = useCommandSheet()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    await createTag(data)
    form.reset()
    close()
    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标签名称</FormLabel>
              <FormControl>
                <Input placeholder="请输入标签名称" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={close}>
            取消
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '创建中...' : '创建'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
