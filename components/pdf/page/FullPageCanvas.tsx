'use client'

import React, { useEffect, useRef } from 'react'
import type { PdfDocument } from '@/types/pdf'

type Props = {
  pdfDoc: PdfDocument
  pageNum: number
}

export default function FullPageCanvas({ pdfDoc, pageNum }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const renderTaskRef = useRef<{ cancel: () => void; promise: Promise<void> } | null>(null)

  useEffect(() => {
    let cancelled = false

    const renderFullPageCanvas = async () => {
      if (!canvasRef.current || !pdfDoc) return

      if (renderTaskRef.current) {
        try {
          await renderTaskRef.current.cancel()
        } catch {
          // ignore cancellation errors
        }
        renderTaskRef.current = null
      }

      if (cancelled) return

      const page = await pdfDoc.getPage(pageNum)
      if (cancelled) return

      const scale = 2
      const viewport = page.getViewport({ scale })
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')!
      canvas.height = viewport.height
      canvas.width = viewport.width

      renderTaskRef.current = page.render({ canvasContext: context, viewport })

      try {
        await renderTaskRef.current.promise
      } catch (e) {
        if (!cancelled) console.error('Render error:', e)
      } finally {
        renderTaskRef.current = null
      }
    }

    renderFullPageCanvas()
    return () => {
      cancelled = true
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel()
        } catch {
          // ignore
        }
        renderTaskRef.current = null
      }
    }
  }, [pdfDoc, pageNum])

  return <canvas ref={canvasRef} style={{ background: '#fff', borderRadius: 12 }} />
}
