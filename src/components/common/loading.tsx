'use client'

import { motion } from 'framer-motion'

export function Loading() {
  return (
    <div className="flex-center flex-col h-[calc(100vh-136px)] w-full">
      <motion.div
        className="relative mt-[-68px]"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      >
        <motion.div
          className="size-16"
          animate={{
            scale: [1, 1.2, 1.2, 1, 1],
            rotate: [0, 0, 180, 180, 0],
            borderRadius: ['10%', '10%', '50%', '50%', '10%'],
          }}
          transition={{
            duration: 3,
            ease: 'easeInOut',
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
          style={{
            background: 'linear-gradient(135deg, var(--color-yume-blue-500), var(--color-yume-green-300))',
          }}
        />
      </motion.div>
    </div>
  )
}
