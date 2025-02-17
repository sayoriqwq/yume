import { Underline } from '@/components/common/tailwind-motion/underline'
import Link from 'next/link'

export function ReadMore({ link }: { link: string }) {
  return (
    <Link
      href={link}
      className="text-foreground hover:text-primary group relative w-fit"
    >
      <span>Read More ?</span>
      <Underline />
    </Link>
  )
}
