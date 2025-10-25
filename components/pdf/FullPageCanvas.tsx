"use client"

import React, { useEffect, useRef } from 'react'

export default function FullPageCanvas({ pdfDoc, pageNum }: { pdfDoc: any; pageNum: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const renderTaskRef = useRef<any>(null)

  useEffect(() => {
    let cancelled = false
    const renderFullPageCanvas = async () => {
      if (!canvasRef.current || !pdfDoc) return
      
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
      
      const scale = 2
      const viewport = page.getViewport({ scale })
      const canvas = canvasRef.current!
      const context = canvas.getContext('2d')!
      canvas.height = viewport.height
      canvas.width = viewport.width
      
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
    renderFullPageCanvas()
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
  }, [pdfDoc, pageNum])

  return <canvas ref={canvasRef} className="w-full h-auto bg-white rounded-lg shadow-2xl" />
}
