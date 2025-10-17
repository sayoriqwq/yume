import type { RefObject } from 'react'
import type { TocFlatItem } from '@/types/toc'
import { atom } from 'jotai'

export const sectionsAtom = atom<TocFlatItem[]>([])

// 可见性集合（高频变更，拆分以避免写放大）
export const visibleIdsAtom = atom<string[]>([])

// DOM 引用存 Map，避免将 ref 混入结构
export const headingRefsAtom = atom<
  Map<string, RefObject<HTMLHeadingElement | null> | null>
>(new Map())
export const outlineRefsAtom = atom<
  Map<string, RefObject<HTMLLIElement | null> | null>
>(new Map())

// 注册/更新 Heading 引用
export const registerHeadingAtom = atom(
  null,
  (
    _get,
    set,
    payload: { id: string, ref: RefObject<HTMLHeadingElement | null> },
  ) => {
    set(headingRefsAtom, (prev) => {
      const cur = prev.get(payload.id)
      if (cur === payload.ref)
        return prev
      const next = new Map(prev)
      next.set(payload.id, payload.ref)
      return next
    })
  },
)

// 注册/更新 Outline 项引用
export const registerOutlineItemAtom = atom(
  null,
  (
    _get,
    set,
    payload: { id: string, ref: RefObject<HTMLLIElement | null> },
  ) => {
    set(outlineRefsAtom, (prev) => {
      const cur = prev.get(payload.id)
      if (cur === payload.ref)
        return prev
      const next = new Map(prev)
      next.set(payload.id, payload.ref)
      return next
    })
  },
)

// 批量设置可见的 heading ids
export const setVisibleIdsAtom = atom(
  null,
  (get, set, ids: string[]) => {
    const prev = get(visibleIdsAtom)
    // 稳定排序前提下的轻量等价性比较
    if (prev === ids)
      return
    if (prev.length === ids.length) {
      let same = true
      for (let i = 0; i < prev.length; i++) {
        if (prev[i] !== ids[i]) {
          same = false
          break
        }
      }
      if (same)
        return
    }
    set(visibleIdsAtom, ids)
  },
)
