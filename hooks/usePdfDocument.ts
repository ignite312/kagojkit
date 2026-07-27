'use client'

import { useEffect, useState } from 'react'
import { configurePdfWorker, pdfjsLib } from '@/lib/pdf'
import type { PdfDocument } from '@/types/pdf'

configurePdfWorker()

export function usePdfDocument(pdfFile: File | null) {
  const [pdfDoc, setPdfDoc] = useState<PdfDocument | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!pdfFile) {
      setPdfDoc(null)
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    setPdfDoc(null)

    const load = async () => {
      try {
        const data = await pdfFile.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data }).promise
        if (!cancelled) {
          setPdfDoc(pdf as unknown as PdfDocument)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to load PDF', err)
        if (!cancelled) {
          setError('Failed to load PDF file')
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [pdfFile])

  return { pdfDoc, loading, error }
}
