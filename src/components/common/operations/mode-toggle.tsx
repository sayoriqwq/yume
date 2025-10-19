'use client'

import { useTheme } from 'next-themes'
import { useMounted } from '@/hooks/use-mounted'
import { LoadingIcon } from '../loading/loading-icon'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const mounted = useMounted()

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  if (!mounted) {
    return <LoadingIcon />
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex-center relative size-5 cursor-pointer"
    >
      <span
        aria-hidden
        className="i-mingcute-sun-line absolute size-5 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0 hover:text-yume-spotlight-foreground"
      />
      <span
        aria-hidden
        className="i-mingcute-moon-line absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 hover:text-yume-spotlight-foreground"
      />
    </button>
  )
}
