import { useAtom } from 'jotai'
import { articlesAtom, categoriesAtom, commentsAtom, tagsAtom, usersAtom } from './store'

export function createEntityHelpers<T extends { id: string | number }>(
  useEntityAtom: () => [Record<string | number, T>, (update: Partial<Record<string | number, T>>) => void],
) {
  return {
    useAdd: () => {
      const [, setEntities] = useEntityAtom()
      return (entity: T) => {
        setEntities({ [entity.id]: entity })
      }
    },
    useAddMany: () => {
      const [, setEntities] = useEntityAtom()
      return (entities: T[]) => {
        const update = entities.reduce((acc, entity) => {
          acc[entity.id] = entity
          return acc
        }, {} as Record<string | number, T>)
        setEntities(update)
      }
    },
    useUpdate: () => {
      const [entities, setEntities] = useEntityAtom()
      return (id: string | number, updates: Partial<T>) => {
        const entity = entities[id]
        if (entity) {
          setEntities({ [id]: { ...entity, ...updates } as T })
        }
      }
    },
    useRemove: () => {
      const [entities, setEntities] = useEntityAtom()
      return (id: string | number) => {
        const newEntities = { ...entities }
        delete newEntities[id]
        setEntities(newEntities)
      }
    },
    useGet: () => {
      const [entities] = useEntityAtom()
      return (id: string | number) => entities[id]
    },
    useGetAll: () => {
      const [entities] = useEntityAtom()
      return () => Object.values(entities)
    },
    useGetFiltered: () => {
      const [entities] = useEntityAtom()
      return (filter: (entity: T) => boolean) => {
        return Object.values(entities).filter(filter)
      }
    },
  }
}

// 为每种实体类型创建助手
export const userHelpers = createEntityHelpers<any>(() => useAtom(usersAtom))
export const articleHelpers = createEntityHelpers<any>(() => useAtom(articlesAtom))
export const categoryHelpers = createEntityHelpers<any>(() => useAtom(categoriesAtom))
export const tagHelpers = createEntityHelpers<any>(() => useAtom(tagsAtom))
export const commentHelpers = createEntityHelpers<any>(() => useAtom(commentsAtom))
