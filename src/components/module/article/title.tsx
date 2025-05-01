import { cn } from '@/lib/utils'

interface TitleProps {
  title: string
  className?: string
}

export function Title({ title, className }: TitleProps) {
  return (
    <h1 className={cn('text-2xl text-center font-extrabold tracking-tight xl:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70', className)}>
      {title}
    </h1>
  )
}
