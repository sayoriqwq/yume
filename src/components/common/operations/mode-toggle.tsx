'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { LoadingIcon } from '../loading/loading-icon'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  useEffect(() => {
    setMounted(true)
  }, [theme])

  if (!mounted) {
    return <LoadingIcon />
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex-center relative size-5 cursor-pointer"
    >
      <Sun className="absolute size-5 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0 hover:text-yume-spotlight-foreground" />
      <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 hover:text-yume-spotlight-foreground" />
    </button>
  )
}
