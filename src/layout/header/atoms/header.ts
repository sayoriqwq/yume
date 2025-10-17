import { atom } from 'jotai'

export type HeaderTabs = '/' | '/blog' | '/friend' | '/about'

export const headerAtom = atom<boolean>(true)
export const headerSelectedAtom = atom<HeaderTabs | null>(null)
