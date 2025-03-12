import type { LucideIcon } from 'lucide-react'
import { SubscribeModal } from '@/components/common/operations/subscribe/modal'
import { siteConfig } from '@/config/site'
import { Github, Mail, Rss } from 'lucide-react'
import Link from 'next/link'
import { NormalContainer } from '../container/Normal'

interface FooterLink {
  href: string
  icon: LucideIcon
}

const links: FooterLink[] = [
  {
    href: siteConfig.links.github,
    icon: Github,
  },
  {
    href: siteConfig.links.email,
    icon: Mail,
  },
  {
    href: siteConfig.rss,
    icon: Rss,
  },
]

export function Footer() {
  return (
    <NormalContainer className="py-0 max-w-full">
      <footer className="bg-background/80 flex-between z-50 w-full border-t px-8 py-4 backdrop-blur-sm">
        <div className="text-md">
          <span>© 2024~2025 sayoriqwq.</span>
        </div>
        <div className="flex items-center gap-4">
          {links.map(({ href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="text-muted-foreground hover:text-accent transition-colors duration-300"
              target="_blank"
            >
              <Icon className="size-6" />
            </Link>
          ))}
          <SubscribeModal />
        </div>
      </footer>
    </NormalContainer>
  )
}
