'use client'

import { useEffect, useState } from 'react'
import DropZone from '@/components/upload/DropZone'
import { formatBytes, isImageFile } from '@/lib/files'
import { downloadBlob, imagesToPdfBlob } from '@/lib/pdf'

type PreviewItem = {
  id: string
  file: File
  url: string
}

function makeId(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`
}

export default function ImagesToPdfWorkspace() {
  const [items, setItems] = useState<PreviewItem[]>([])
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      setItems((prev) => {
        prev.forEach((item) => URL.revokeObjectURL(item.url))
        return prev
      })
    }
  }, [])

  const addFiles = (incoming: File[]) => {
    setMessage(null)
    setItems((prev) => {
      const keys = new Set(prev.map((p) => p.id))
      const next = [...prev]
      for (const file of incoming) {
        const id = makeId(file)
        if (!keys.has(id)) {
          keys.add(id)
          next.push({ id, file, url: URL.createObjectURL(file) })
        }
      }
      return next
    })
  }

  const move = (index: number, direction: -1 | 1) => {
    setItems((prev) => {
      const target = index + direction
      if (target < 0 || target >= prev.length) return prev
      const copy = [...prev]
      ;[copy[index], copy[target]] = [copy[target], copy[index]]
      return copy
    })
  }

  const remove = (index: number) => {
    setItems((prev) => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
  }

  const clear = () => {
    setItems((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.url))
      return []
    })
  }

  const convert = async () => {
    if (items.length === 0) {
      setMessage('Add at least one image.')
      return
    }
    setBusy(true)
    setMessage(null)
    try {
      const { blob, pageCount } = await imagesToPdfBlob(items.map((i) => i.file))
      downloadBlob(blob, `images_${pageCount}_pages.pdf`)
      setMessage(`Created a PDF with ${pageCount} page${pageCount === 1 ? '' : 's'}.`)
    } catch (err) {
      console.error(err)
      setMessage('Could not convert these images. Try JPG or PNG.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="workspace">
      <div className="workspace-intro">
        <h2>Images → PDF</h2>
        <p>Add images, reorder them, and download a single PDF.</p>
      </div>

      <DropZone
        accept="image/*,.png,.jpg,.jpeg,.webp,.gif,.bmp"
        multiple
        title="Drop images here"
        hint="JPG, PNG, WebP, and more"
        filter={isImageFile}
        invalidMessage="Please choose image files only."
        onFiles={addFiles}
      />

      {items.length > 0 && (
        <ul className="image-grid">
          {items.map((item, index) => (
            <li key={item.id} className="image-card">
              <img src={item.url} alt={item.file.name} />
              <div className="image-card-body">
                <p className="file-name">{item.file.name}</p>
                <p className="file-size">
                  {index + 1} · {formatBytes(item.file.size)}
                </p>
                <div className="file-actions">
                  <button type="button" className="btn btn-ghost" disabled={index === 0} onClick={() => move(index, -1)}>
                    Up
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    disabled={index === items.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    Down
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => remove(index)}>
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="action-bar">
        <button type="button" className="btn btn-ghost" disabled={items.length === 0 || busy} onClick={clear}>
          Clear
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={items.length === 0 || busy}
          onClick={convert}
        >
          {busy ? 'Creating…' : `Create PDF (${items.length || 0})`}
        </button>
      </div>

      {message && <p className="feedback">{message}</p>}
    </section>
  )
}
