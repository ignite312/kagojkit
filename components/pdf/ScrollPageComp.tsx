"use client"

import React, { useEffect, useRef, memo } from 'react'

type Props = {
  pdfDoc: any
  pageNum: number
  isSelected: boolean
  isRangeStart: boolean
  onPageClick: (n: number) => void
  scrollSize?: { width: number; height: number }
}

export default memo(function ScrollPageComp({ pdfDoc, pageNum, isSelected, isRangeStart, onPageClick, scrollSize }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const renderTaskRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false
    const render = async () => {
      if (!pdfDoc || !canvasRef.current) return
      
      // Cancel any ongoing render task
      if (renderTaskRef.current) {
        try {
          await renderTaskRef.current.cancel()
        } catch (e) {
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
        if (!cancelled) {
          console.error('Render error:', e)
        }
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
        } catch (e) {
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
