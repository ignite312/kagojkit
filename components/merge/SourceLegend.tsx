'use client'

import type { SourceColorScheme } from '@/lib/sourceColors'

type SourceLegendProps = {
  sources: SourceColorScheme[]
  swapFromKey: string | null
  onMove: (sourceKey: string, direction: -1 | 1) => void
  onSwapClick: (sourceKey: string) => void
  onRemove: (sourceKey: string) => void
}

export default function SourceLegend({
  sources,
  swapFromKey,
  onMove,
  onSwapClick,
  onRemove,
}: SourceLegendProps) {
  if (sources.length === 0) return null

  const pdfs = sources.filter((s) => s.kind === 'pdf')
  const images = sources.filter((s) => s.kind === 'image')

  return (
    <div className="source-legend">
      <div className="source-legend-head">
        <p className="source-legend-title">
          Sources · {pdfs.length} PDF{pdfs.length === 1 ? '' : 's'}
          {images.length > 0
            ? ` · ${images.length} image${images.length === 1 ? '' : 's'}`
            : ''}
        </p>
        <p className="source-legend-hint">
          Click one source, then another to swap whole files. Or use Up / Down / Swap.
        </p>
      </div>

      <ul className="source-serial-list">
        {sources.map((source, index) => {
          const selected = swapFromKey === source.id
          const target = swapFromKey !== null && !selected

          return (
            <li
              key={source.id}
              className={`source-serial-row ${selected ? 'is-swap-selected' : ''} ${target ? 'is-swap-target' : ''}`}
              style={
                {
                  '--source-accent': source.accent,
                  '--source-soft': source.soft,
                  '--source-ink': source.ink,
                } as React.CSSProperties
              }
            >
              <button
                type="button"
                className="source-serial-hit"
                onClick={() => onSwapClick(source.id)}
                title={
                  swapFromKey
                    ? 'Click to swap with this file'
                    : 'Click to select this file for swap'
                }
              >
                <span className="source-serial-num">{source.serial + 1}</span>
                <div className="source-serial-text">
                  <p className="source-serial-name" title={source.label}>
                    {source.label}
                  </p>
                  <p className="source-serial-sub">
                    {source.kind === 'pdf' ? 'PDF' : 'Image'} · {source.pageCount} page
                    {source.pageCount === 1 ? '' : 's'}
                  </p>
                </div>
              </button>

              <div className="file-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={index === 0}
                  onClick={() => onMove(source.id, -1)}
                >
                  Up
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={index === sources.length - 1}
                  onClick={() => onMove(source.id, 1)}
                >
                  Down
                </button>
                <button
                  type="button"
                  className={`btn ${selected ? 'btn-accent' : 'btn-ghost'}`}
                  onClick={() => onSwapClick(source.id)}
                >
                  Swap
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => onRemove(source.id)}>
                  Remove
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
