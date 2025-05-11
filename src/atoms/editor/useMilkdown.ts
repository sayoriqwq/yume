import { useAtom } from 'jotai'
import { milkdownContentAtom } from './milkdown'

export function useMilkdown() {
  const [milkdownContent, setMilkdownContent] = useAtom(milkdownContentAtom)

  return { milkdownContent, setMilkdownContent }
}
