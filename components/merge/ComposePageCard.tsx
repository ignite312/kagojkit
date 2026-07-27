'use client'

import { useMemo, useRef } from 'react'
import type { SourceColorScheme } from '@/lib/sourceColors'

type ComposePageCardProps = {
  index: number
  total: number
  label: string
  sourceName: string
  kind: 'pdf' | 'image'
  previewUrl: string | null
  scheme: SourceColorScheme
  swapArmed: boolean
  swapSelected: boolean
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
  onSwapClick: () => void
  onPreview: () => void
}

export default function ComposePageCard({
  index,
  total,
  label,
  sourceName,
  kind,
  previewUrl,
  scheme,
  swapArmed,
  swapSelected,
  onMove,
  onRemove,
  onSwapClick,
  onPreview,
}: ComposePageCardProps) {
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const className = useMemo(() => {
    const parts = ['compose-card']
    if (swapSelected) parts.push('is-swap-selected')
    if (swapArmed && !swapSelected) parts.push('is-swap-target')
    return parts.join(' ')
  }, [swapArmed, swapSelected])

  const style = {
    '--source-accent': scheme.accent,
    '--source-soft': scheme.soft,
    '--source-ink': scheme.ink,
  } as React.CSSProperties

  const handlePreviewClick = () => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current)
      clickTimerRef.current = null
    }

    // Delay so a double-click can cancel and open preview instead
    clickTimerRef.current = setTimeout(() => {
      clickTimerRef.current = null
      onSwapClick()
    }, 250)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current)
      clickTimerRef.current = null
    }
    onPreview()
  }

  return (
    <li className={className} style={style}>
      <button
        type="button"
        className="compose-card-preview"
        onClick={handlePreviewClick}
        onDoubleClick={handleDoubleClick}
        title={
          swapArmed
            ? 'Click to swap with this page'
            : 'Click to swap · Double-click to preview'
        }
      >
        {previewUrl ? (
          <img src={previewUrl} alt={label} draggable={false} />
        ) : (
          <div className="compose-card-placeholder">{kind === 'pdf' ? 'PDF' : 'IMG'}</div>
        )}
        <span className="compose-card-badge">{index + 1}</span>
        <span className="compose-kind-chip">{kind === 'pdf' ? 'PDF' : 'Image'}</span>
      </button>

      <div className="compose-card-body">
        <p className="file-name">{label}</p>
        <p className="file-size compose-source-name" title={sourceName}>
          {sourceName}
        </p>
        <div className="file-actions">
          <button type="button" className="btn btn-ghost" disabled={index === 0} onClick={() => onMove(-1)}>
            Up
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
          >
            Down
          </button>
          <button
            type="button"
            className={`btn ${swapSelected ? 'btn-accent' : 'btn-ghost'}`}
            onClick={onSwapClick}
          >
            Swap
          </button>
          <button type="button" className="btn btn-ghost" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}
