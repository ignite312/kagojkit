import type { ComposePage } from '@/types/compose'

/** Unique source keys in current document order. */
export function getSourceOrder(pages: ComposePage[]): string[] {
  const order: string[] = []
  for (const page of pages) {
    if (!order.includes(page.sourceKey)) order.push(page.sourceKey)
  }
  return order
}

function regroupBySourceOrder(pages: ComposePage[], order: string[]): ComposePage[] {
  const groups = new Map<string, ComposePage[]>()
  for (const page of pages) {
    const list = groups.get(page.sourceKey) ?? []
    list.push(page)
    groups.set(page.sourceKey, list)
  }
  return order.flatMap((key) => groups.get(key) ?? [])
}

/** Move a whole file (all its pages) up or down in serial order. */
export function moveSourceBlock(
  pages: ComposePage[],
  sourceKey: string,
  direction: -1 | 1
): ComposePage[] {
  const order = getSourceOrder(pages)
  const index = order.indexOf(sourceKey)
  const target = index + direction
  if (index < 0 || target < 0 || target >= order.length) return pages
  ;[order[index], order[target]] = [order[target], order[index]]
  return regroupBySourceOrder(pages, order)
}

/** Swap two whole files (all pages of each) in serial order. */
export function swapSourceBlocks(
  pages: ComposePage[],
  sourceKeyA: string,
  sourceKeyB: string
): ComposePage[] {
  if (sourceKeyA === sourceKeyB) return pages
  const order = getSourceOrder(pages)
  const a = order.indexOf(sourceKeyA)
  const b = order.indexOf(sourceKeyB)
  if (a < 0 || b < 0) return pages
  ;[order[a], order[b]] = [order[b], order[a]]
  return regroupBySourceOrder(pages, order)
}

/** Remove every page belonging to a source file. */
export function removeSourceBlock(
  pages: ComposePage[],
  sourceKey: string
): { pages: ComposePage[]; removed: ComposePage[] } {
  const removed = pages.filter((page) => page.sourceKey === sourceKey)
  return {
    pages: pages.filter((page) => page.sourceKey !== sourceKey),
    removed,
  }
}
