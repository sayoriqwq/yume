import Link from 'next/link'
import { SubscribeModal } from '@/components/common/operations/subscribe/modal'
import { siteConfig } from '@/config/site'
import { NormalContainer } from '../container/Normal'

interface FooterLink {
  href: string
  iconClass: string
}

const links: FooterLink[] = [
  {
    href: siteConfig.links.github,
    iconClass: 'i-mingcute-github-2-line',
  },
  {
    href: siteConfig.links.email,
    iconClass: 'i-mingcute-mail-line',
  },
  {
    href: siteConfig.rss,
    iconClass: 'i-mingcute-rss-line',
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
          {links.map(({ href, iconClass }) => (
            <Link
              key={href}
              href={href}
              className="text-muted-foreground hover:text-accent transition-colors duration-300"
              target="_blank"
            >
              <span className={`size-6 ${iconClass}`} aria-hidden="true" />
            </Link>
          ))}
          <SubscribeModal />
        </div>
      </footer>
    </NormalContainer>
  )
}
