export function updateEntities<T extends { id: number }>(prev: Record<number, T>, update: Record<number, T>) {
  return {
    ...prev,
    ...update,
  }
}
export function updateIds(prev: number[], update: number[]) {
  console.log('prev', prev)
  console.log('update', update)
  return [...new Set([...prev, ...update])]
}
export function updateRelations(prev: Record<number, number[]>, update: Record<number, number[]>) {
  return {
    ...prev,
    ...update,
  }
}
