'use client'

import React, { useEffect, useRef, memo } from 'react'
import type { PageSize, PdfDocument } from '@/types/pdf'

type Props = {
  pdfDoc: PdfDocument
  pageNum: number
  isSelected: boolean
  isRangeStart: boolean
  onPageClick: (n: number) => void
  scrollSize?: PageSize
}

export default memo(function ScrollPage({
  pdfDoc,
  pageNum,
  isSelected,
  isRangeStart,
  onPageClick,
  scrollSize,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const renderTaskRef = useRef<{ cancel: () => void; promise: Promise<void> } | null>(null)

  useEffect(() => {
    let cancelled = false

    const render = async () => {
      if (!pdfDoc || !canvasRef.current) return

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

      const canvas = canvasRef.current
      if (!canvas) return

      const scale = 1.2
      const viewport = page.getViewport({ scale })
      const context = canvas.getContext('2d')!

      if (scrollSize) {
        canvas.width = scrollSize.width
        canvas.height = scrollSize.height
      } else {
        canvas.width = viewport.width
        canvas.height = viewport.height
      }

      renderTaskRef.current = page.render({ canvasContext: context, viewport })

      try {
        await renderTaskRef.current.promise
      } catch (e) {
        if (!cancelled) console.error('Render error:', e)
      } finally {
        renderTaskRef.current = null
      }
    }

    render()
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
  }, [pdfDoc, pageNum, scrollSize])

  return (
    <div
      data-page={pageNum}
      className={`scroll-page ${isSelected ? 'selected' : ''} ${isRangeStart ? 'range-start' : ''}`}
      onClick={() => onPageClick(pageNum)}
    >
      <div className="scroll-page-header">
        <div className="font-semibold text-sm">Page {pageNum}</div>
        <input
          type="checkbox"
          className="w-5 h-5 cursor-pointer"
          checked={isSelected}
          onChange={() => onPageClick(pageNum)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <canvas ref={canvasRef} />
    </div>
  )
})
