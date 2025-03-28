'use client'

import { useCategoriesData } from '@/atoms/dashboard/hooks/useCategory'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

const formSchema = z.object({
  name: z.string().min(1, '请输入分类名称'),
  cover: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function CreateCategoryForm() {
  const { createCategory } = useCategoriesData()
  const { close } = useCommandSheet()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      cover: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    try {
      await createCategory({
        name: values.name,
        cover: values.cover || undefined,
      })
      toast.success('创建成功')
      close()
    }
    catch (error) {
      toast.error('创建失败')
      console.error('创建失败:', error)
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>分类名称</FormLabel>
              <FormControl>
                <Input placeholder="请输入分类名称" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cover"
          render={({ field }) => (
            <FormItem>
              <FormLabel>封面图片</FormLabel>
              <FormControl>
                <Tabs defaultValue="url" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url">图片链接</TabsTrigger>
                    <TabsTrigger value="upload">本地上传</TabsTrigger>
                  </TabsList>
                  <TabsContent value="url">
                    <Input
                      placeholder="请输入图片链接"
                      {...field}
                    />
                  </TabsContent>
                  <TabsContent value="upload">
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500">暂不支持本地上传</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
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
