import type { ViewMode } from '@/types/pdf'

type ViewerToolbarProps = {
  fileName: string
  totalPages: number
  selectedCount: number
  viewMode: ViewMode
  rangeMode: boolean
  extracting: boolean
  onToggleViewMode: () => void
  onToggleRangeMode: () => void
  onSelectAll: () => void
  onClearSelection: () => void
  onExtract: () => void
  onReset: () => void
}

export default function ViewerToolbar({
  fileName,
  totalPages,
  selectedCount,
  viewMode,
  rangeMode,
  extracting,
  onToggleViewMode,
  onToggleRangeMode,
  onSelectAll,
  onClearSelection,
  onExtract,
  onReset,
}: ViewerToolbarProps) {
  return (
    <div className="viewer-bar">
      <div className="viewer-bar-meta">
        <button type="button" className="btn btn-ghost" onClick={onReset}>
          ← Back
        </button>
        <div>
          <p className="file-name">{fileName}</p>
          <p className="file-size">
            {totalPages} pages · {selectedCount} selected
          </p>
        </div>
      </div>

      <div className="viewer-bar-actions">
        <button type="button" className="btn btn-ghost" onClick={onToggleViewMode}>
          {viewMode === 'grid' ? 'Scroll' : 'Grid'}
        </button>
        <button
          type="button"
          className={`btn ${rangeMode ? 'btn-accent' : 'btn-ghost'}`}
          onClick={onToggleRangeMode}
        >
          Range
        </button>
        <button type="button" className="btn btn-ghost" onClick={onSelectAll}>
          All
        </button>
        <button type="button" className="btn btn-ghost" onClick={onClearSelection}>
          Clear
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={selectedCount === 0 || extracting}
          onClick={onExtract}
        >
          {extracting ? 'Extracting…' : `Extract (${selectedCount})`}
        </button>
      </div>
    </div>
  )
}
