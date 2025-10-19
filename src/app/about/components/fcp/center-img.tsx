import { motion, useScroll, useTransform } from 'framer-motion'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useRef } from 'react'
import { buildImgSrc } from '@/lib/utils'
import { IMG_PADDING } from './constants/page-config'

export function CenterImg() {
  const { resolvedTheme } = useTheme()

  const isDarkMode = resolvedTheme === 'dark'

  const targetRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['end end', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85])

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  //   useMotionValueEvent(scrollYProgress, 'change', (latest) => {
  //     console.log(latest)
  //   })

  const renderImage = () => {
    return (
      <>
        <Image
          src={isDarkMode ? buildImgSrc('bg-dark') : buildImgSrc('bg-light')}
          alt="Background Image"
          fill
          priority
          className="object-cover"
          quality={100}
        />
        <motion.div
          className="absolute inset-0 bg-neutral-950/50"
          style={{ opacity }}
        />
      </>
    )
  }

  return (
    <motion.div
      className="sticky inset-0 z-0 overflow-hidden rounded-3xl"
      ref={targetRef}
      style={{
        scale,
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: `${IMG_PADDING}px`,
      }}
    >
      {renderImage()}
    </motion.div>
  )
}
