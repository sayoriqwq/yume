import { motion, useScroll, useTransform } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { useRef } from 'react'
import { Typewriter } from '@/components/common/type-writer'

function ArrowToNext() {
  const lenis = useLenis()
  return (
    <motion.button
      onClick={() => {
        lenis?.scrollTo(1000, { offset: 0 })
      }}
      className="flex-center mt-8 size-12 rounded-full border-2 border-white/50 text-white/80 transition-colors hover:border-white hover:text-white"
      animate={{
        y: [0, 8, 0],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      }}
    >
      <span aria-hidden className="i-mingcute-arrow-down-line size-6" />
    </motion.button>
  )
}

export function Overlay() {
  const targetRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [250, -250])
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0])

  return (
    <div>
      <motion.div
        style={{ y, opacity }}
        ref={targetRef}
        className="flex-center absolute left-0 top-0 h-screen w-full text-white mix-blend-overlay backdrop-opacity-20"
      >
        <div className="flex-center flex-col gap-6">
          <h1 className="font-aboreto text-8xl drop-shadow-lg">
            yume
          </h1>
          <p className="text-3xl tracking-wide">
            <Typewriter
              words={[
                '欢迎来到我的小站',
                'a place to share your dreams',
              ]}
              typingSpeed={150}
              deletingSpeed={100}
              delayBetweenWords={2000}
            />
          </p>
          <ArrowToNext />
        </div>
      </motion.div>
    </div>
  )
}
