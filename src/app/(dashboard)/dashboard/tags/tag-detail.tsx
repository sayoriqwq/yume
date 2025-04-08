import { useTagDetail } from '@/atoms/dashboard/hooks/useTag'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BookOpen } from 'lucide-react'

export function TagDetail({ id }: { id: number }) {
  const { articleIds, articleMap } = useTagDetail(id)

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        {articleIds.map(articleId => (
          <Card key={articleId} className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{articleMap[articleId].title}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(articleMap[articleId].createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
