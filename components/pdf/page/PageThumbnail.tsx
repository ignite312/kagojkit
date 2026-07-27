'use client'

import React, { useEffect, useRef, memo } from 'react'
import type { PageSize, PdfDocument } from '@/types/pdf'

type Props = {
  pdfDoc: PdfDocument
  pageNum: number
  isSelected: boolean
  isRangeStart: boolean
  onPageClick: (n: number) => void
  onDoubleClick: (n: number) => void
  thumbSize?: PageSize
}

export default memo(function PageThumbnail({
  pdfDoc,
  pageNum,
  isSelected,
  isRangeStart,
  onPageClick,
  onDoubleClick,
  thumbSize,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const renderTaskRef = useRef<{ cancel: () => void; promise: Promise<void> } | null>(null)
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

      const scale = 0.6
      const viewport = page.getViewport({ scale })
      const canvas = canvasRef.current
      if (!canvas) return

      const context = canvas.getContext('2d')!
      if (thumbSize) {
        canvas.width = thumbSize.width
        canvas.height = thumbSize.height
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
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current)
        clickTimerRef.current = null
      }
    }
  }, [pdfDoc, pageNum, thumbSize])

  const handleClick = () => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current)
      clickTimerRef.current = null
    }
    clickTimerRef.current = setTimeout(() => {
      onPageClick(pageNum)
      clickTimerRef.current = null
    }, 200)
  }

  const handleDoubleClick = () => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current)
      clickTimerRef.current = null
    }
    onDoubleClick(pageNum)
  }

  return (
    <div
      data-page={pageNum}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`pdf-page-container ${isSelected ? 'selected' : ''} ${isRangeStart ? 'range-start' : ''}`}
      role="button"
      tabIndex={0}
    >
      <div className="page-number">Page {pageNum}</div>
      <canvas ref={canvasRef} />
    </div>
  )
})
