'use client'

/*

spotlight code by Innei

reference: https://github.com/Innei/Shiro/blob/8481a63718c4aee2a850e4ebd1148ee5b2d62bce/src/components/layout/header/internal/HeaderContent.tsx

*/

import { headerAtom, modalAtom } from '@/atoms/header'
import { cn } from '@/lib/utils'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { CenterNavs } from './center-navs'
import { Logo } from './logo'
import { Operations } from './operations'

export function Header() {
  const [header, setHeader] = useAtom(headerAtom)
  const [isModalOpen] = useAtom(modalAtom)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    setHeader(latest - previous < 0)
  })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const radius = useMotionValue(0)

  const handleMouseMove = useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - bounds.left)
      mouseY.set(clientY - bounds.top)
      radius.set(Math.hypot(bounds.width, bounds.height) / 2.5)
    },
    [mouseX, mouseY, radius],
  )

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 65%)`

  return (
    <AnimatePresence mode="wait">
      <header
        className="fixed inset-1 top-0 z-50 h-14"
        style={{
          paddingRight: isModalOpen ? 15 : 0,
        }}
      >
        <motion.div
          className={cn(
            'relative',
            'bg-card/75 text-card-foreground',
            'mx-auto flex h-14 px-2 w-fit items-center',
            'rounded-full inset-shadow-lg',
            'backdrop-blur-xl',
            'backdrop-saturate-150',
            'border',
            'group',
            'pointer-events-auto',
          )}
          onMouseMove={handleMouseMove}
          initial={{
            y: 32,
            opacity: 1,
          }}
          animate={{
            y: header ? 32 : '-105%',
            opacity: header ? 1 : 0,
          }}
          exit={{
            y: '-105%',
            opacity: 0,
          }}
          transition={{
            type: 'tween',
            duration: 0.3,
          }}
        >
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background }}
          />
          <div className="flex items-center gap-4 px-4">
            <Logo />
            <CenterNavs />
            <Operations />
          </div>
        </motion.div>
      </header>
    </AnimatePresence>
  )
}
