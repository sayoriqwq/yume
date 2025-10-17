'use client'

import { motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { useMemo } from 'react'

import { OutlineItem } from '../outline-item'
import { sectionsAtom, visibleIdsAtom, outlineRefsAtom } from '../atoms/toc'
import { useRegisterHeading } from '../atoms/use-register'
import { useVisibleSections } from '../atoms/use-visible-sections'
import type { TocFlatItem } from '../types'

interface TocViewProps {
  flat: TocFlatItem[]
  minDepth: number
}

export function TocView({ flat, minDepth }: TocViewProps) {
  const [sections, setSections] = useAtom(sectionsAtom)
  // 初始化
  useMemo(() => {
    if (!flat.length)
      return
    setSections((prev) => {
      if (prev.length === flat.length) {
        let same = true
        for (let i = 0; i < prev.length; i++) {
          const a = prev[i]
          const b = flat[i]
          if (a.id !== b.id || a.depth !== b.depth || a.title !== b.title) {
            same = false
            break
          }
        }
        if (same)
          return prev
      }
      return flat
    })
  }, [flat, setSections])
  useVisibleSections()
  const [visibleIds] = useAtom(visibleIdsAtom)
  const [outlineRefs] = useAtom(outlineRefsAtom)
  // 计算连续高亮条 top/height
  const elMap = useMemo(() => {
    const map: Record<string, HTMLLIElement | null | undefined> = {}
    for (const section of sections)
      map[section.id] = outlineRefs.get(section.id)?.current
    return map
  }, [sections, outlineRefs])

  const firstVisibleIndex = Math.max(0, sections.findIndex(s => s.id === visibleIds[0]))
  const height = visibleIds.reduce((h, id) => h + (elMap[id]?.offsetHeight || 0), 0)
  const top = sections.slice(0, firstVisibleIndex).reduce((t, s) => t + (elMap[s.id]?.offsetHeight || 0), 0)

  useRegisterHeading()

  return (
    <aside className="relative mt-4 text-sm">
      <div className="mb-4 font-semibold">目录</div>
      <div className="relative pl-3">
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-separator" />
        <motion.div
          className="absolute left-0 w-[2px] bg-accent"
          layout
          initial={false}
          animate={{
            opacity: height ? 1 : 0,
            height,
            top,
            transition: { duration: 0.3, ease: 'easeInOut' },
          }}
        />
        <ul className="m-0 list-none pl-4">
          {flat.map(f => (
            <OutlineItem
              key={f.id}
              id={f.id}
              title={f.title}
              depth={f.depth - minDepth}
              active={visibleIds.includes(f.id)}
            />
          ))}
        </ul>
      </div>
    </aside>
  )
}
