'use client'

import { useEffect, useState } from 'react'
import { computePageSizes } from '@/lib/pdf'
import type { PageSizeMap, PdfDocument } from '@/types/pdf'

export function usePageSizes(pdfDoc: PdfDocument | null) {
  const [thumbSizes, setThumbSizes] = useState<PageSizeMap>({})
  const [scrollSizes, setScrollSizes] = useState<PageSizeMap>({})

  useEffect(() => {
    if (!pdfDoc) {
      setThumbSizes({})
      setScrollSizes({})
      return
    }

    let cancelled = false

    const run = async () => {
      try {
        const { thumbMap, scrollMap } = await computePageSizes(pdfDoc)
        if (!cancelled) {
          setThumbSizes(thumbMap)
          setScrollSizes(scrollMap)
        }
      } catch {
        // ignore sizing failures
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [pdfDoc])

  return { thumbSizes, scrollSizes }
}
