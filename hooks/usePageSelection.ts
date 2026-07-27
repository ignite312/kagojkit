'use client'

import { useCallback, useState } from 'react'

export function usePageSelection(totalPages: number) {
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set())
  const [rangeMode, setRangeMode] = useState(false)
  const [rangeStart, setRangeStart] = useState<number | null>(null)

  const handlePageClick = useCallback(
    (pageNum: number) => {
      if (rangeMode) {
        if (rangeStart === null) {
          setRangeStart(pageNum)
          return
        }

        const start = Math.min(rangeStart, pageNum)
        const end = Math.max(rangeStart, pageNum)
        setSelectedPages((prev) => {
          const next = new Set(prev)
          for (let i = start; i <= end; i++) next.add(i)
          return next
        })
        setRangeStart(null)
        return
      }

      setSelectedPages((prev) => {
        const next = new Set(prev)
        if (next.has(pageNum)) next.delete(pageNum)
        else next.add(pageNum)
        return next
      })
    },
    [rangeMode, rangeStart]
  )

  const selectAll = useCallback(() => {
    const all = new Set<number>()
    for (let i = 1; i <= totalPages; i++) all.add(i)
    setSelectedPages(all)
  }, [totalPages])

  const clearSelection = useCallback(() => {
    setSelectedPages(new Set())
    setRangeStart(null)
  }, [])

  const toggleRangeMode = useCallback(() => {
    setRangeMode((prev) => !prev)
    setRangeStart(null)
  }, [])

  const sortedSelected = Array.from(selectedPages).sort((a, b) => a - b)

  return {
    selectedPages,
    sortedSelected,
    rangeMode,
    rangeStart,
    handlePageClick,
    selectAll,
    clearSelection,
    toggleRangeMode,
  }
}
