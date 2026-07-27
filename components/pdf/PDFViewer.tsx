'use client'

import { useState } from 'react'
import ViewerToolbar from '@/components/pdf/toolbar/ViewerToolbar'
import RangeModeBanner from '@/components/pdf/toolbar/RangeModeBanner'
import GridView from '@/components/pdf/views/GridView'
import ScrollView from '@/components/pdf/views/ScrollView'
import FullPagePreviewModal from '@/components/pdf/preview/FullPagePreviewModal'
import { usePdfDocument } from '@/hooks/usePdfDocument'
import { usePageSelection } from '@/hooks/usePageSelection'
import { usePageSizes } from '@/hooks/usePageSizes'
import { downloadBlob, extractPagesToBlob } from '@/lib/pdf'
import type { ViewMode } from '@/types/pdf'

type Props = {
  pdfFile: File
  onReset: () => void
}

export default function PDFViewer({ pdfFile, onReset }: Props) {
  const { pdfDoc, loading, error } = usePdfDocument(pdfFile)
  const totalPages = pdfDoc?.numPages ?? 0
  const {
    selectedPages,
    rangeMode,
    rangeStart,
    handlePageClick,
    selectAll,
    clearSelection,
    toggleRangeMode,
  } = usePageSelection(totalPages)
  const { thumbSizes, scrollSizes } = usePageSizes(pdfDoc)

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [extracting, setExtracting] = useState(false)
  const [fullPageView, setFullPageView] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const pages = pdfDoc
    ? Array.from({ length: pdfDoc.numPages }, (_, i) => i + 1)
    : []

  const extractPages = async () => {
    if (selectedPages.size === 0) {
      setFeedback('Select at least one page.')
      return
    }

    setExtracting(true)
    setFeedback(null)
    try {
      const { blob, pageCount } = await extractPagesToBlob(pdfFile, selectedPages)
      downloadBlob(blob, `extracted_${pageCount}_pages.pdf`)
      setFeedback(`Saved ${pageCount} page${pageCount === 1 ? '' : 's'}.`)
    } catch (err) {
      console.error(err)
      setFeedback('Could not extract pages from this PDF.')
    } finally {
      setExtracting(false)
    }
  }

  if (error) {
    return (
      <section className="workspace">
        <p className="feedback is-error">{error}</p>
        <button type="button" className="btn btn-ghost" onClick={onReset}>
          ← Try another file
        </button>
      </section>
    )
  }

  if (loading || !pdfDoc) {
    return (
      <section className="workspace workspace-center">
        <div className="loading-spinner" />
        <p className="muted">Loading PDF…</p>
      </section>
    )
  }

  return (
    <section className="workspace">
      <ViewerToolbar
        fileName={pdfFile.name}
        totalPages={pdfDoc.numPages}
        selectedCount={selectedPages.size}
        viewMode={viewMode}
        rangeMode={rangeMode}
        extracting={extracting}
        onToggleViewMode={() => setViewMode((v) => (v === 'grid' ? 'scroll' : 'grid'))}
        onToggleRangeMode={toggleRangeMode}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
        onExtract={extractPages}
        onReset={onReset}
      />

      {rangeMode && <RangeModeBanner rangeStart={rangeStart} />}
      {feedback && <p className="feedback">{feedback}</p>}

      {viewMode === 'grid' ? (
        <GridView
          pdfDoc={pdfDoc}
          pages={pages}
          selectedPages={selectedPages}
          rangeStart={rangeStart}
          thumbSizes={thumbSizes}
          onPageClick={handlePageClick}
          onDoubleClick={setFullPageView}
        />
      ) : (
        <ScrollView
          pdfDoc={pdfDoc}
          pages={pages}
          selectedPages={selectedPages}
          rangeStart={rangeStart}
          scrollSizes={scrollSizes}
          onPageClick={handlePageClick}
        />
      )}

      {fullPageView !== null && (
        <FullPagePreviewModal
          pdfDoc={pdfDoc}
          pageNum={fullPageView}
          totalPages={pdfDoc.numPages}
          onClose={() => setFullPageView(null)}
        />
      )}
    </section>
  )
}
