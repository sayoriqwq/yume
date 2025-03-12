import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

export function Intro() {
  return (
    <section className="flex-center mt-10 flex-col gap-2 text-center font-sans font-bold">
      <Link href="/about">
        <Avatar className="size-28 transition duration-300 ring ring-muted hover:ring-2 hover:ring-ring">
          <AvatarImage src="https://s3-yume.s3.ap-northeast-1.amazonaws.com/avatar.webp" />
          <AvatarFallback>Ciallo~</AvatarFallback>
        </Avatar>
      </Link>
      <p className="break-words text-2xl">
        <span className=""> sayori</span>
        <span className="text-accent">qwq</span>
      </p>
      <p className="text-md break-words text-muted-foreground">
        Student | Front-end Developer
      </p>
    </section>
  )
}
