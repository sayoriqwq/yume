import type { TocEntry, TocFlatItem } from '.'
import { BIG_DEPTH_NUMBER } from '@/constants/numbers'

export function getIdFromUrl(url: string) {
  return url.startsWith('#') ? url.slice(1) : url
}

export function flatten(entries: TocEntry, depth = 0, acc: TocFlatItem[] = []) {
  for (const entry of entries) {
    const id = getIdFromUrl(entry.url)
    acc.push({ id, title: entry.title, depth })
    if (entry.items?.length)
      flatten(entry.items, depth + 1, acc)
  }
  return acc
}

// 统一缩进起点
export function getMinDepth(flat: TocFlatItem[]) {
  return flat.reduce((p, c) => Math.min(p, c.depth), BIG_DEPTH_NUMBER) || 0
}
