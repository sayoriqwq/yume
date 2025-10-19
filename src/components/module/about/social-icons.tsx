'use client'

import { motion } from 'framer-motion'
import { socialIconSet } from '@/components/icon/social'
import { siteConfig } from '@/config/site'

type IconName = keyof typeof siteConfig.links

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
      <div className="flex items-center space-x-4">
        {Object.entries(socialIconSet).map(([name, { iconClass, bgColor }]) => {
          const link = siteConfig.links[name as IconName]
          if (!link)
            return null
          const backgroundColor = bgColor

          return (
            <motion.a
              key={name}
              target="_blank"
              rel="noreferrer"
              href={link}
              className="flex-center size-10 rounded-full p-2 text-white"
              {...iconAnimation}
              style={{ backgroundColor }}
              aria-label={name}
            >
              <span className={`size-5 ${iconClass}`} aria-hidden="true" />
            </motion.a>
          )
        })}
      </div>
    </motion.div>
  )
}
