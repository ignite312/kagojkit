'use client'

import { useCallback, useId, useRef, useState } from 'react'

type DropZoneProps = {
  accept: string
  multiple?: boolean
  hint: string
  title: string
  onFiles: (files: File[]) => void
  filter?: (file: File) => boolean
  invalidMessage?: string
}

export default function DropZone({
  accept,
  multiple = false,
  hint,
  title,
  onFiles,
  filter,
  invalidMessage = 'Unsupported file type',
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const [dragging, setDragging] = useState(false)

  const takeFiles = useCallback(
    (list: FileList | null) => {
      if (!list?.length) return
      const files = Array.from(list)
      const valid = filter ? files.filter(filter) : files
      if (valid.length === 0) {
        alert(invalidMessage)
        return
      }
      onFiles(multiple ? valid : valid.slice(0, 1))
    },
    [filter, invalidMessage, multiple, onFiles]
  )

  return (
    <div
      className={`dropzone ${dragging ? 'is-dragging' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        takeFiles(e.dataTransfer.files)
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
    >
      <div className="dropzone-icon" aria-hidden>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M12 16V4" />
          <path d="M8 8l4-4 4 4" />
          <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
        </svg>
      </div>
      <p className="dropzone-title">{title}</p>
      <p className="dropzone-hint">{hint}</p>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          takeFiles(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}
