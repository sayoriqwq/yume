'use client'

import { useArticlesData } from '@/atoms/dashboard/hooks/useArticle'
import { useCategoriesData } from '@/atoms/dashboard/hooks/useCategory'
import { useMilkdown } from '@/atoms/editor/useMilkdown'
import { MDXPreview } from '@/components/mdx/MDXPreview'
import { MilkdownEditorWrapper } from '@/components/mdx/milkdown/milkdown-wrapper'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { ChevronUp, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArticleTags } from '../[id]/article-tags'

export function ArticleForm() {
  const router = useRouter()
  const { createArticle } = useArticlesData()
  const { categoryIds, categoryMap } = useCategoriesData()

  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [showMetadata, setShowMetadata] = useState(false)

  const { present } = useModalStack()
  const { milkdownContent } = useMilkdown()

  const showArticleModal = useCallback(() => {
    present({
      id: 'new-article-preview',
      title: '新文章预览',
      content: () => (
        <MDXPreview
          markdown={milkdownContent}
        />
      ),
    })
  }, [present, milkdownContent])

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      slug: '',
      categoryId: 0,
      cover: '',
      published: false,
      mood: '',
      weather: '',
      location: '',
    },
  })

  const handleSave = async (formData: any) => {
    const payload = {
      ...formData,
      content: milkdownContent,
      tagIds: selectedTags,
    }

    await createArticle(payload)
    router.push('/dashboard/articles')
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">新建文章</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/articles')}>
            取消
          </Button>
          <Button type="button" onClick={form.handleSubmit(handleSave)}>
            保存
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标题</FormLabel>
                    <FormControl>
                      <Input placeholder="输入文章标题" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>描述</FormLabel>
                    <FormControl>
                      <Input placeholder="输入文章描述" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center mb-4">
                <FormLabel className="text-base">内容</FormLabel>
                <Button type="button" variant="ghost" size="sm" onClick={showArticleModal}>
                  <Eye className="h-4 w-4 mr-2" />
                  预览
                </Button>
              </div>
              <MilkdownEditorWrapper />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <FormLabel className="text-base">发布选项</FormLabel>
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>发布</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>分类</FormLabel>
                      <Select
                        value={field.value ? String(field.value) : ''}
                        onValueChange={value => field.onChange(Number(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择分类" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryIds.map(id => (
                            <SelectItem key={id} value={String(id)}>
                              {categoryMap[id]?.name || `分类 ${id}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>别名</FormLabel>
                      <FormControl>
                        <Input placeholder="文章URL别名" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>标签</FormLabel>
                  <ArticleTags selectedTagIds={selectedTags} onChange={setSelectedTags} />
                </FormItem>

                <FormField
                  control={form.control}
                  name="cover"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>封面图</FormLabel>
                      <FormControl>
                        <Input placeholder="封面图URL" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div
                className="flex justify-between items-center cursor-pointer mb-4"
                onClick={() => setShowMetadata(prev => !prev)}
              >
                <FormLabel className="text-base">元数据</FormLabel>
                <ChevronUp className={cn('h-5 w-5 transition-transform', !showMetadata && 'rotate-180')} />
              </div>

              {showMetadata && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="mood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>心情</FormLabel>
                        <FormControl>
                          <Input placeholder="写作时的心情" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weather"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>天气</FormLabel>
                        <FormControl>
                          <Input placeholder="当时的天气" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>位置</FormLabel>
                        <FormControl>
                          <Input placeholder="当前位置" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
