'use client'

import { useArticlesData } from '@/atoms/dashboard/hooks/useArticle'
import { useCategoriesData } from '@/atoms/dashboard/hooks/useCategory'
import { MDXPreview } from '@/components/mdx/MDXPreview'
import { TextAreaEditor } from '@/components/mdx/TextAreaEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { ChevronDown, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useModalStack } from 'rc-modal-sheet'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArticleTags } from './article-tags'

interface FormProps {
  id: number
}

export function ArticleForm({ id }: FormProps) {
  const router = useRouter()
  const { isLoading, error, updateArticle, articleMap } = useArticlesData()
  const { categoryIds, categoryMap } = useCategoriesData()
  const [content, setContent] = useState<string>('')

  const article = articleMap[id]
  const [selectedTags, setSelectedTags] = useState<number[]>(article?.tagIds || [])

  const [showMetadata, setShowMetadata] = useState(false)

  const { present } = useModalStack()

  const showArticleModal = useCallback(() => {
    const modalId = `article-${id}`
    present({
      id: modalId,
      title: `${article?.title || '文章'}`,
      content: () => (
        <MDXPreview
          markdown={content}
        />
      ),
    })
  }, [present, content, article?.title, id])
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      slug: '',
      categoryId: 0,
      cover: '',
      published: false,
    },
  })

  useEffect(() => {
    if (article) {
      form.reset({
        title: article.title || '',
        description: article.description || '',
        slug: article.slug || '',
        categoryId: article.categoryId || 0,
        cover: article.cover || '',
        published: article.published || false,
      })

      // 设置内容
      setContent(article.content || '')

      // 设置标签
      if (article.tagIds && article.tagIds.length > 0) {
        setSelectedTags(article.tagIds)
      }
    }
  }, [article, form])

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  const handleSave = async (formData: any) => {
    const payload = {
      ...formData,
      content,
      tagIds: selectedTags,
    }

    await updateArticle(id, payload)
  }

  if (isLoading) {
    return <div>加载中...</div>
  }

  if (error) {
    return (
      <div>
        错误:
        {error.message}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="h-8"
          >
            返回
          </Button>
          <h1 className="text-xl font-bold truncate max-w-[400px]">
            {article?.title || '未命名'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMetadata(!showMetadata)}
            className="h-8"
          >
            <ChevronDown className={cn(
              'h-4 w-4 mr-1.5 transition-transform',
              showMetadata ? 'rotate-180' : '',
            )}
            />
            元数据
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={showArticleModal}
            className="h-8"
          >
            <Eye className="h-4 w-4 mr-1.5" />
            预览
          </Button>
        </div>
      </div>

      {/* 元数据表单 - 可折叠 */}
      {showMetadata && (
        <Card className="w-full shadow-sm">
          <CardContent className="py-3 px-4">
            <Form {...form}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">标题</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入文章标题" {...field} className="h-8 text-sm" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cover"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">封面图</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入封面图URL" {...field} className="h-8 text-sm" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">分类</FormLabel>
                      <Select
                        onValueChange={value => field.onChange(Number(value))}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="选择分类" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryIds.map(id => (
                            <SelectItem key={id} value={String(id)}>
                              {categoryMap[id].name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="text-xs font-medium">发布状态</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-3">
                <FormLabel className="text-xs font-medium">标签</FormLabel>
                <ArticleTags
                  selectedTagIds={selectedTags}
                  onChange={setSelectedTags}
                  className="mt-1"
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  已选择
                  {' '}
                  {selectedTags.length}
                  {' '}
                  个标签
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* TextAreaEditor编辑器部分 */}
      <TextAreaEditor
        content={content}
        onChange={handleContentChange}
        onSave={form.handleSubmit(handleSave)}
      />
    </div>
  )
}
