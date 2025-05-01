export function ArticleDescription({ description }: { description: string }) {
  return (
    <div className="text-muted-foreground bg-muted max-w-2xl mx-auto p-4 leading-relaxed border-l-4 border-primary/90 rounded-xl">
      {description}
    </div>
  )
}
