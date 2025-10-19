'use client'

import { motion } from 'framer-motion'
import React, { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TypewriterProps {
  words: string[]
  typingSpeed?: number
  deletingSpeed?: number
  delayBetweenWords?: number
  className?: string
  cursor?: boolean
  blinkSpeed?: number
}

export function Typewriter({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 2000,
  className,
  cursor = true,
  blinkSpeed = 0.7,
}: TypewriterProps) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)

  const type = useCallback(() => {
    const currentWord = words[wordIndex]

    if (isDeleting) {
      setText(currentWord.substring(0, text.length - 1))

      if (text.length === 0) {
        setIsDeleting(false)
        setWordIndex(prev => (prev + 1) % words.length)
      }
    }
    else {
      setText(currentWord.substring(0, text.length + 1))

      if (text.length === currentWord.length) {
        setIsWaiting(true)
        setTimeout(() => {
          setIsWaiting(false)
          setIsDeleting(true)
        }, delayBetweenWords)
      }
    }
  }, [text, isDeleting, wordIndex, words, delayBetweenWords])

  useEffect(() => {
    if (isWaiting)
      return

    const timer = setTimeout(
      type,
      isDeleting ? deletingSpeed : typingSpeed,
    )

    return () => clearTimeout(timer)
  }, [isDeleting, type, deletingSpeed, typingSpeed, isWaiting])

  return (
    <span className={cn('inline-block', className)}>
      {text}
      {cursor && (
        <motion.span
          className="ml-1 inline-block h-[0.8em] w-[2px] bg-current align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: blinkSpeed,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      )}
    </span>
  )
}
