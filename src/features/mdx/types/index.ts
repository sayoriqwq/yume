export interface TocItem {
  title: string
  url: string
  items: TocItem[]
}

export type TocEntry = TocItem[]
export interface TocFlatItem {
  id: string
  title: string
  depth: number
}
