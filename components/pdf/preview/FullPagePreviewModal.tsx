'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import FullPageCanvas from '@/components/pdf/page/FullPageCanvas'
import type { PdfDocument } from '@/types/pdf'

type FullPagePreviewModalProps = {
  pdfDoc: PdfDocument
  pageNum: number
  totalPages: number
  onClose: () => void
}

export default function FullPagePreviewModal({
  pdfDoc,
  pageNum,
  totalPages,
  onClose,
}: FullPagePreviewModalProps) {
  const [mounted, setMounted] = useState(false)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const scrollY = window.scrollY
    const { style } = document.body
    const prev = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
      overflow: style.overflow,
    }

    style.position = 'fixed'
    style.top = `-${scrollY}px`
    style.left = '0'
    style.right = '0'
    style.width = '100%'
    style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      style.position = prev.position
      style.top = prev.top
      style.left = prev.left
      style.right = prev.right
      style.width = prev.width
      style.overflow = prev.overflow
      window.scrollTo(0, scrollY)
    }
  }, [])

  if (!mounted) return null

  return createPortal(
    <div
      className="modal-scrim modal-scrim--viewport"
      onClick={() => onCloseRef.current()}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <h3>
            Page {pageNum} of {totalPages}
          </h3>
          <button type="button" onClick={() => onCloseRef.current()}>
            Close
          </button>
        </div>
        <FullPageCanvas pdfDoc={pdfDoc} pageNum={pageNum} />
      </div>
    </div>,
    document.body
  )
}
