import Link from 'next/link'
import { SubscribeModal } from '@/components/common/operations/subscribe/modal'
import { socialIconSet } from '@/components/icon/social'
import { Separator } from '@/components/ui/separator'
import { siteConfig } from '@/config/site'
import { NormalContainer } from '../container/Normal'

interface FooterLink {
  href: string
  iconClass: string
}

const links: FooterLink[] = [
  {
    href: siteConfig.links.github,
    iconClass: socialIconSet.github.iconClass,
  },
  {
    href: siteConfig.links.email,
    iconClass: socialIconSet.email.iconClass,
  },
  {
    href: siteConfig.links.rss,
    iconClass: socialIconSet.rss.iconClass,
  },
]

export function Footer() {
  return (
    <NormalContainer className="py-0 max-w-full">
      <Separator />
      <footer className="flex-between z-50 w-full px-8 py-4">
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
