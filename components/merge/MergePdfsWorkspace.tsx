'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import DropZone from '@/components/upload/DropZone'
import ComposePageCard from '@/components/merge/ComposePageCard'
import ComposePagePreviewView from '@/components/merge/ComposePagePreviewView'
import SourceLegend from '@/components/merge/SourceLegend'
import { isImageFile, isMergeableFile, isPdfFile } from '@/lib/files'
import {
  composePagesToBlob,
  downloadBlob,
  loadPdfDocument,
  moveSourceBlock,
  removeSourceBlock,
  renderPageThumbFromDoc,
  swapSourceBlocks,
} from '@/lib/pdf'
import { assignSourceColorSchemes, sourceFileKey } from '@/lib/sourceColors'
import type { ComposePage } from '@/types/compose'

let pageId = 0
function nextId() {
  pageId += 1
  return `page-${Date.now()}-${pageId}`
}

export default function MergePdfsWorkspace() {
  const [pages, setPages] = useState<ComposePage[]>([])
  const [busy, setBusy] = useState(false)
  const [adding, setAdding] = useState(false)
  const [swapFrom, setSwapFrom] = useState<number | null>(null)
  const [sourceSwapFrom, setSourceSwapFrom] = useState<string | null>(null)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const savedScrollYRef = useRef(0)

  const openPreview = (index: number) => {
    savedScrollYRef.current = window.scrollY
    setSwapFrom(null)
    setSourceSwapFrom(null)
    setPreviewIndex(index)
  }

  const closePreview = () => {
    const y = savedScrollYRef.current
    setPreviewIndex(null)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, behavior: 'auto' })
      })
    })
  }

  useEffect(() => {
    return () => {
      setPages((prev) => {
        prev.forEach((page) => {
          if (page.kind === 'image' && page.previewUrl) {
            URL.revokeObjectURL(page.previewUrl)
          }
        })
        return prev
      })
    }
  }, [])

  const schemeByKey = useMemo(() => assignSourceColorSchemes(pages), [pages])
  const sourceSchemes = useMemo(() => Array.from(schemeByKey.values()), [schemeByKey])

  const addFiles = async (incoming: File[]) => {
    if (incoming.length === 0) return
    setAdding(true)
    setMessage(null)
    setSwapFrom(null)
    setSourceSwapFrom(null)

    try {
      const created: ComposePage[] = []

      for (const file of incoming) {
        if (isPdfFile(file)) {
          const pdf = await loadPdfDocument(file)
          const key = sourceFileKey('pdf', file)
          for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
            const previewUrl = await renderPageThumbFromDoc(pdf, pageNumber)
            created.push({
              id: nextId(),
              kind: 'pdf',
              file,
              pageNumber,
              label: `Page ${pageNumber}`,
              sourceName: file.name,
              sourceKey: key,
              previewUrl,
            })
          }
          continue
        }

        if (isImageFile(file)) {
          created.push({
            id: nextId(),
            kind: 'image',
            file,
            label: file.name,
            sourceName: file.name,
            sourceKey: sourceFileKey('image', file),
            previewUrl: URL.createObjectURL(file),
          })
        }
      }

      if (created.length === 0) {
        setMessage('No usable PDF or image pages found.')
        return
      }

      setPages((prev) => [...prev, ...created])
      setMessage(`Added ${created.length} page${created.length === 1 ? '' : 's'}.`)
    } catch (err) {
      console.error(err)
      setMessage('Could not read one of the files. Try again.')
    } finally {
      setAdding(false)
    }
  }

  const move = (index: number, direction: -1 | 1) => {
    setSwapFrom(null)
    setSourceSwapFrom(null)
    setPages((prev) => {
      const target = index + direction
      if (target < 0 || target >= prev.length) return prev
      const copy = [...prev]
      ;[copy[index], copy[target]] = [copy[target], copy[index]]
      return copy
    })
  }

  const remove = (index: number) => {
    setSwapFrom(null)
    setSourceSwapFrom(null)
    setPages((prev) => {
      const page = prev[index]
      if (page?.kind === 'image' && page.previewUrl) {
        URL.revokeObjectURL(page.previewUrl)
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSwapClick = (index: number) => {
    setSourceSwapFrom(null)
    if (swapFrom === null) {
      setSwapFrom(index)
      setMessage('Swap page: click another page to exchange.')
      return
    }

    if (swapFrom === index) {
      setSwapFrom(null)
      setMessage(null)
      return
    }

    setPages((prev) => {
      const copy = [...prev]
      ;[copy[swapFrom], copy[index]] = [copy[index], copy[swapFrom]]
      return copy
    })
    setSwapFrom(null)
    setMessage('Pages swapped.')
  }

  const moveSource = (sourceKey: string, direction: -1 | 1) => {
    setSwapFrom(null)
    setSourceSwapFrom(null)
    setPages((prev) => moveSourceBlock(prev, sourceKey, direction))
    setMessage('Source serial updated.')
  }

  const handleSourceSwap = (sourceKey: string) => {
    setSwapFrom(null)
    if (sourceSwapFrom === null) {
      setSourceSwapFrom(sourceKey)
      setMessage('Swap file: click another source to exchange whole files.')
      return
    }

    if (sourceSwapFrom === sourceKey) {
      setSourceSwapFrom(null)
      setMessage(null)
      return
    }

    setPages((prev) => swapSourceBlocks(prev, sourceSwapFrom, sourceKey))
    setSourceSwapFrom(null)
    setMessage('Whole files swapped — serial order updated.')
  }

  const removeSource = (sourceKey: string) => {
    setSwapFrom(null)
    setSourceSwapFrom(null)
    setPages((prev) => {
      const { pages: next, removed } = removeSourceBlock(prev, sourceKey)
      removed.forEach((page) => {
        if (page.kind === 'image' && page.previewUrl) {
          URL.revokeObjectURL(page.previewUrl)
        }
      })
      return next
    })
    setMessage('Source removed.')
  }

  const clear = () => {
    setPages((prev) => {
      prev.forEach((page) => {
        if (page.kind === 'image' && page.previewUrl) {
          URL.revokeObjectURL(page.previewUrl)
        }
      })
      return []
    })
    setSwapFrom(null)
    setSourceSwapFrom(null)
    setMessage(null)
  }

  const merge = async () => {
    if (pages.length === 0) {
      setMessage('Add at least one PDF or image.')
      return
    }
    setBusy(true)
    setMessage(null)
    setSwapFrom(null)
    setSourceSwapFrom(null)
    try {
      const { blob, pageCount } = await composePagesToBlob(pages)
      downloadBlob(blob, `merged_${pageCount}_pages.pdf`)
      setMessage(`Saved ${pageCount} page${pageCount === 1 ? '' : 's'} as one PDF.`)
    } catch (err) {
      console.error(err)
      setMessage('Could not build the PDF. Check your files and try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {previewIndex !== null && pages[previewIndex] && (
        <ComposePagePreviewView
          page={pages[previewIndex]}
          index={previewIndex}
          total={pages.length}
          onClose={closePreview}
          onPrev={() => setPreviewIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
          onNext={() =>
            setPreviewIndex((i) =>
              i !== null && i < pages.length - 1 ? i + 1 : i
            )
          }
        />
      )}

      <section
        className="workspace"
        hidden={previewIndex !== null}
        aria-hidden={previewIndex !== null}
      >
      <div className="workspace-intro">
        <h2>Merge & arrange</h2>
        <p>
          Mix PDFs and images. Reorder whole files by serial, rearrange pages, or double-click to preview.
        </p>
      </div>

      <DropZone
        accept="application/pdf,.pdf,image/*,.png,.jpg,.jpeg,.webp,.gif,.bmp"
        multiple
        title={pages.length === 0 ? 'Drop PDFs or images here' : 'Add more PDFs or images'}
        hint="Click a page, then another to swap · Double-click to preview"
        filter={isMergeableFile}
        invalidMessage="Please choose PDF or image files."
        onFiles={addFiles}
      />

      {adding && (
        <p className="muted" style={{ marginTop: '0.85rem' }}>
          Reading files and building page previews…
        </p>
      )}

      {sourceSwapFrom !== null && (
        <p className="range-hint">
          File swap mode: click another source to swap whole PDFs/images (all their pages).
          Click the same source again to cancel.
        </p>
      )}

      {swapFrom !== null && (
        <p className="range-hint">
          Page swap mode: click another page to exchange with page {swapFrom + 1}.
          Click the same page again to cancel.
        </p>
      )}

      <SourceLegend
        sources={sourceSchemes}
        swapFromKey={sourceSwapFrom}
        onMove={moveSource}
        onSwapClick={handleSourceSwap}
        onRemove={removeSource}
      />

      {pages.length > 0 && (
        <ul className="compose-grid">
          {pages.map((page, index) => {
            const scheme = schemeByKey.get(page.sourceKey)!

            return (
              <ComposePageCard
                key={page.id}
                index={index}
                total={pages.length}
                label={page.label}
                sourceName={page.sourceName}
                kind={page.kind}
                previewUrl={page.previewUrl}
                scheme={scheme}
                swapArmed={swapFrom !== null}
                swapSelected={swapFrom === index}
                onMove={(direction) => move(index, direction)}
                onRemove={() => remove(index)}
                onSwapClick={() => handleSwapClick(index)}
                onPreview={() => openPreview(index)}
              />
            )
          })}
        </ul>
      )}

      <div className="action-bar">
        <button type="button" className="btn btn-ghost" disabled={pages.length === 0 || busy || adding} onClick={clear}>
          Clear all
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={pages.length === 0 || busy || adding}
          onClick={merge}
        >
          {busy ? 'Building…' : `Download PDF (${pages.length})`}
        </button>
      </div>

      {message && <p className="feedback">{message}</p>}
    </section>
    </>
  )
}
