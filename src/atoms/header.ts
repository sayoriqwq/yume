import { atom } from 'jotai'

export const headerAtom = atom<boolean>(true)

export type HeaderTabs = '/' | '/blog' | '/friend' | '/about'

export const headerSelectedAtom = atom<HeaderTabs | null>(null)

export const modalAtom = atom<boolean>(false)
