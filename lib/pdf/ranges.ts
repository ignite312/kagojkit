/** Collapse sorted page numbers into range labels, e.g. [1,2,3,5] → ["1-3","5"] */
export function findRanges(pages: number[]): string[] {
  if (pages.length === 0) return []

  const ranges: string[] = []
  let start = pages[0]
  let end = pages[0]

  for (let i = 1; i < pages.length; i++) {
    const next = pages[i]
    if (next === end + 1) {
      end = next
      continue
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`)
    start = end = next
  }

  ranges.push(start === end ? `${start}` : `${start}-${end}`)
  return ranges
}
