'use client'

import { useState } from 'react'
import ViewerToolbar from '@/components/pdf/toolbar/ViewerToolbar'
import RangeModeBanner from '@/components/pdf/toolbar/RangeModeBanner'
import GridView from '@/components/pdf/views/GridView'
import ScrollView from '@/components/pdf/views/ScrollView'
import SelectionPreviewModal from '@/components/pdf/preview/SelectionPreviewModal'
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
    sortedSelected,
    rangeMode,
    rangeStart,
    handlePageClick,
    selectAll,
    clearSelection,
    toggleRangeMode,
  } = usePageSelection(totalPages)
  const { thumbSizes, scrollSizes } = usePageSizes(pdfDoc)

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showPreview, setShowPreview] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [fullPageView, setFullPageView] = useState<number | null>(null)

  const pages = pdfDoc
    ? Array.from({ length: pdfDoc.numPages }, (_, i) => i + 1)
    : []

  const extractPages = async () => {
    if (selectedPages.size === 0) {
      alert('Select at least one page')
      return
    }

    setExtracting(true)
    try {
      const { blob, pageCount } = await extractPagesToBlob(pdfFile, selectedPages)
      downloadBlob(blob, `extracted_${pageCount}_pages.pdf`)
      alert('PDF extracted')
    } catch (err) {
      console.error(err)
      alert('Failed to extract pages')
    } finally {
      setExtracting(false)
    }
  }

  if (error) {
    return (
      <div className="card p-16 text-center">
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <button onClick={onReset} className="btn btn-secondary">
          Try another file
        </button>
      </div>
    )
  }

  if (loading || !pdfDoc) {
    return (
      <div className="card p-16 text-center">
        <div className="loading-spinner mx-auto mb-4" />
        <p className="text-gray-700 font-medium">Loading PDF...</p>
      </div>
    )
  }

  return (
    <div>
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
        onPreview={() => setShowPreview(true)}
        onExtract={extractPages}
        onReset={onReset}
      />

      {rangeMode && <RangeModeBanner rangeStart={rangeStart} />}

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

      {showPreview && (
        <SelectionPreviewModal
          selectedPages={sortedSelected}
          onClose={() => setShowPreview(false)}
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
    </div>
  )
}
