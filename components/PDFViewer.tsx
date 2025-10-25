"use client"

import React, { useCallback, useEffect, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import PageThumbnail from '@/components/pdf/PageThumbnail'
import ScrollPageComp from '@/components/pdf/ScrollPageComp'
import FullPageCanvas from '@/components/pdf/FullPageCanvas'
import { computePageSizes } from '@/utils/pdf'

// Configure PDF.js worker (CDN)
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
}

type Props = {
  pdfFile: File
  onReset: () => void
}

export default function PDFViewer({ pdfFile, onReset }: Props) {
  const [pdfDoc, setPdfDoc] = useState<any | null>(null)
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set())
  const [viewMode, setViewMode] = useState<'grid' | 'scroll'>('grid')
  const [rangeMode, setRangeMode] = useState(false)
  const [rangeStart, setRangeStart] = useState<number | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [fullPageView, setFullPageView] = useState<number | null>(null)
  const [thumbSizes, setThumbSizes] = useState<Record<number, { width: number; height: number }>>({})
  const [scrollSizes, setScrollSizes] = useState<Record<number, { width: number; height: number }>>({})

  // Load PDF when file changes
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const ab = await pdfFile.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: ab }).promise
        if (!cancelled) setPdfDoc(pdf)
      } catch (err) {
        console.error('Failed to load PDF', err)
        alert('Failed to load PDF file')
      }
    }
    load()
    return () => { cancelled = true }
  }, [pdfFile])

  // Precompute sizes to avoid layout shift / shaking
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!pdfDoc) return
      try {
        const { thumbMap, scrollMap } = await computePageSizes(pdfDoc)
        if (!cancelled) {
          setThumbSizes(thumbMap)
          setScrollSizes(scrollMap)
        }
      } catch (e) {
        // ignore
      }
    }
    run()
    return () => { cancelled = true }
  }, [pdfDoc])

  const pages = pdfDoc ? Array.from({ length: pdfDoc.numPages }, (_, i) => i + 1) : []

  const handlePageClick = useCallback((pageNum: number) => {
    if (rangeMode) {
      if (rangeStart === null) {
        setRangeStart(pageNum)
      } else {
        const start = Math.min(rangeStart, pageNum)
        const end = Math.max(rangeStart, pageNum)
        setSelectedPages(prev => {
          const s = new Set(prev)
          for (let i = start; i <= end; i++) s.add(i)
          return s
        })
        setRangeStart(null)
      }
      return
    }

    setSelectedPages(prev => {
      const s = new Set(prev)
      if (s.has(pageNum)) s.delete(pageNum)
      else s.add(pageNum)
      return s
    })
  }, [rangeMode, rangeStart])

  const selectAll = () => {
    if (!pdfDoc) return
    const all = new Set<number>()
    for (let i = 1; i <= pdfDoc.numPages; i++) all.add(i)
    setSelectedPages(all)
  }

  const clearSelection = () => {
    setSelectedPages(new Set())
    setRangeStart(null)
  }

  const toggleViewMode = () => setViewMode(v => (v === 'grid' ? 'scroll' : 'grid'))

  const toggleRangeMode = () => {
    setRangeMode(r => !r)
    setRangeStart(null)
  }

  const findRanges = (arr: number[]) => {
    if (arr.length === 0) return []
    const out: string[] = []
    let a = arr[0], b = arr[0]
    for (let i = 1; i < arr.length; i++) {
      const n = arr[i]
      if (n === b + 1) b = n
      else { out.push(a === b ? `${a}` : `${a}-${b}`); a = b = n }
    }
    out.push(a === b ? `${a}` : `${a}-${b}`)
    return out
  }

  const extractPages = async () => {
    if (selectedPages.size === 0) { alert('Select at least one page'); return }
    setExtracting(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const ab = await pdfFile.arrayBuffer()
      const src = await PDFDocument.load(ab)
      const dest = await PDFDocument.create()
      const sorted = Array.from(selectedPages).sort((a, b) => a - b)
      for (const p of sorted) {
        const [copied] = await dest.copyPages(src, [p - 1])
        dest.addPage(copied)
      }
      const bytes = await dest.save()
      const blob = new Blob([bytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `extracted_${sorted.length}_pages.pdf`; a.click()
      URL.revokeObjectURL(url)
      alert('PDF extracted')
    } catch (err) {
      console.error(err); alert('Failed to extract pages')
    } finally {
      setExtracting(false)
    }
  }

  if (!pdfDoc) {
    return (
      <div className="card p-16 text-center">
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-gray-700 font-medium">Loading PDF...</p>
      </div>
    )
  }

  const sortedSelected = Array.from(selectedPages).sort((a, b) => a - b)
  const ranges = findRanges(sortedSelected)

  return (
    <div>
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{pdfFile.name}</h2>
            <p className="text-gray-600 text-sm">{pdfDoc.numPages} pages <span className="mx-2">•</span> <span className="badge">{selectedPages.size} selected</span></p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={toggleViewMode} className="btn btn-outline">{viewMode === 'grid' ? 'Scroll View' : 'Grid View'}</button>
            <button 
              onClick={toggleRangeMode} 
              className={`btn ${rangeMode ? 'btn-primary' : 'btn-outline'}`}
            >
              {rangeMode ? 'Range: ON' : 'Range'}
            </button>
            <button onClick={selectAll} className="btn btn-outline">Select All</button>
            <button onClick={clearSelection} className="btn btn-secondary">Clear</button>
            {selectedPages.size > 0 && <button onClick={() => setShowPreview(true)} className="btn btn-outline">Preview</button>}
            <button onClick={extractPages} disabled={selectedPages.size === 0 || extracting} className="btn btn-primary">{extracting ? 'Processing...' : 'Extract Pages'}</button>
            <button onClick={onReset} className="btn btn-secondary">New PDF</button>
          </div>
        </div>
      </div>

      {rangeMode && (
        <div className="card p-4 mb-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <div>
              <strong className="text-yellow-800 text-sm">Range Selection Mode Active</strong>
              <p className="text-yellow-700 text-xs mt-1">{rangeStart === null ? 'Click the first page to start the range.' : `First selected: ${rangeStart}. Click the second page to select range.`}</p>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
          {pages.map(p => (
            <PageThumbnail
              key={p}
              pdfDoc={pdfDoc}
              pageNum={p}
              isSelected={selectedPages.has(p)}
              isRangeStart={rangeStart === p}
              onPageClick={handlePageClick}
              onDoubleClick={(n) => setFullPageView(n)}
              thumbSize={thumbSizes[p]}
            />
          ))}
        </div>
      ) : (
        <div className="card p-0 max-w-4xl mx-auto">
          <div className="max-h-[80vh] overflow-y-auto p-6">
            {pages.map(p => (
              <ScrollPageComp
                key={p}
                pdfDoc={pdfDoc}
                pageNum={p}
                isSelected={selectedPages.has(p)}
                isRangeStart={rangeStart === p}
                onPageClick={handlePageClick}
                scrollSize={scrollSizes[p]}
              />
            ))}
          </div>
        </div>
      )}

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-6 overflow-auto" onClick={() => setShowPreview(false)}>
          <div className="card max-w-3xl mx-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Selected Pages Preview</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-600 hover:text-gray-900">Close</button>
            </div>
            <div className="border-t border-gray-300 my-4"></div>
            <p className="text-gray-600 text-sm mb-3">You have selected <strong>{selectedPages.size}</strong> page(s):</p>
            <div className="flex flex-wrap gap-2 mb-4">{Array.from(selectedPages).sort((a,b)=>a-b).map(p => <span key={p} className="badge badge-primary px-3 py-2 text-sm">{p}</span>)}</div>
            {ranges.length > 0 && (<div><p className="text-gray-600 text-sm mb-3"><strong>Page Ranges:</strong></p><div className="bg-gray-100 p-3 rounded-md font-mono text-sm">{ranges.join(', ')}</div></div>)}
          </div>
        </div>
      )}

      {fullPageView !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-auto" onClick={() => setFullPageView(null)}>
          <div className="min-h-screen flex flex-col items-center justify-start py-6 px-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-full max-w-5xl mb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-white text-xl font-semibold">Page {fullPageView} of {pdfDoc.numPages}</h3>
                <button onClick={() => setFullPageView(null)} className="text-white hover:text-gray-300">Close</button>
              </div>
            </div>
            <div className="w-full max-w-5xl">
              <FullPageCanvas pdfDoc={pdfDoc} pageNum={fullPageView} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
