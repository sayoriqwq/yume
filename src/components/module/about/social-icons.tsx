'use client'

import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site'

type IconName = keyof typeof siteConfig.links

interface Icon {
  name: IconName
  Icon: React.JSX.Element
}

const BRAND_COLORS: Record<IconName, string> = {
  github: '#24292e',
  email: '#EA4335',
}

const iconSet: Icon[] = [
  {
    name: 'github',
    Icon: <span className="i-mingcute-github-line size-6"></span>,
  },
]

const iconAnimation = {
  whileHover: {
    scale: 1.1,
    rotate: [-5, 5, -5, 5, 0],
    transition: {
      rotate: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 0.4,
      },
      scale: {
        duration: 0.2,
      },
    },
  },
}

export function SocialIcons() {
  return (
    <motion.div>
      <div className="flex-center space-x-4">
        {iconSet.map(({ name, Icon }) => {
          const link = siteConfig.links[name]
          if (!link)
            return null
          const backgroundColor = BRAND_COLORS[name]

          return (
            <motion.a
              key={name}
              target="_blank"
              rel="noreferrer"
              href={link}
              className="flex-center size-12 rounded-full p-2 text-white"
              {...iconAnimation}
              style={{ backgroundColor }}
              aria-label={name}
            >
              {Icon}
            </motion.a>
          )
        })}
      </div>
    </motion.div>
  )
}
