'use client'

import { useEffect, useState } from 'react'
import FullPageCanvas from '@/components/pdf/page/FullPageCanvas'
import { loadPdfDocument } from '@/lib/pdf'
import type { ComposePage } from '@/types/compose'
import type { PdfDocument } from '@/types/pdf'

type ComposePagePreviewViewProps = {
  page: ComposePage
  index: number
  total: number
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}

export default function ComposePagePreviewView({
  page,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: ComposePagePreviewViewProps) {
  const [pdfDoc, setPdfDoc] = useState<PdfDocument | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Jump to top only when entering preview, not when flipping Prev/Next
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev?.()
      if (e.key === 'ArrowRight') onNext?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    if (page.kind !== 'pdf') {
      setPdfDoc(null)
      setError(null)
      return
    }

    let cancelled = false
    setPdfDoc(null)
    setError(null)

    loadPdfDocument(page.file)
      .then((doc) => {
        if (!cancelled) setPdfDoc(doc as unknown as PdfDocument)
      })
      .catch((err) => {
        console.error(err)
        if (!cancelled) setError('Could not load PDF preview.')
      })

    return () => {
      cancelled = true
    }
  }, [page])

  return (
    <section className="workspace compose-preview-view" aria-label="Page preview">
      <div className="compose-preview-toolbar">
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          ← Back
        </button>
        <div className="compose-preview-meta">
          <p className="file-name">
            Page {index + 1} of {total}
          </p>
          <p className="file-size">
            {page.kind === 'pdf' ? `${page.sourceName} · ${page.label}` : page.sourceName}
          </p>
        </div>
        <div className="file-actions">
          <button type="button" className="btn btn-ghost" disabled={index === 0} onClick={onPrev}>
            Prev
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={index >= total - 1}
            onClick={onNext}
          >
            Next
          </button>
        </div>
      </div>

      <div className="compose-preview-stage">
        {page.kind === 'image' && page.previewUrl && (
          <img src={page.previewUrl} alt={page.label} className="compose-preview-image" />
        )}

        {page.kind === 'pdf' && error && <p className="feedback is-error">{error}</p>}

        {page.kind === 'pdf' && !error && !pdfDoc && (
          <div className="workspace-center" style={{ minHeight: 220 }}>
            <div className="loading-spinner" />
            <p className="muted">Loading preview…</p>
          </div>
        )}

        {page.kind === 'pdf' && pdfDoc && (
          <FullPageCanvas pdfDoc={pdfDoc} pageNum={page.pageNumber} />
        )}
      </div>
    </section>
  )
}
