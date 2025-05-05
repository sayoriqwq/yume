export function ArticleDescription({ description }: { description: string }) {
  return (
    <div className="w-full rounded-lg shadow-md border border-border/30 overflow-hidden p-4">
      <div className="mb-2 font-bold">摘要</div>
      <div className="text-muted-foreground border-l-3 border-primary/70 pl-4 py-3 px-4 my-0 w-full">
        {description}
      </div>
    </div>
  )
}
