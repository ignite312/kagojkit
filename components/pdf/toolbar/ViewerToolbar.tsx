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
  onPreview: () => void
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
  onPreview,
  onExtract,
  onReset,
}: ViewerToolbarProps) {
  return (
    <div className="card p-5 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">{fileName}</h2>
          <p className="text-gray-600 text-sm">
            {totalPages} pages
            <span className="mx-2">•</span>
            <span className="badge">{selectedCount} selected</span>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={onToggleViewMode} className="btn btn-outline">
            {viewMode === 'grid' ? 'Scroll View' : 'Grid View'}
          </button>
          <button
            onClick={onToggleRangeMode}
            className={`btn ${rangeMode ? 'btn-primary' : 'btn-outline'}`}
          >
            {rangeMode ? 'Range: ON' : 'Range'}
          </button>
          <button onClick={onSelectAll} className="btn btn-outline">
            Select All
          </button>
          <button onClick={onClearSelection} className="btn btn-secondary">
            Clear
          </button>
          {selectedCount > 0 && (
            <button onClick={onPreview} className="btn btn-outline">
              Preview
            </button>
          )}
          <button
            onClick={onExtract}
            disabled={selectedCount === 0 || extracting}
            className="btn btn-primary"
          >
            {extracting ? 'Processing...' : 'Extract Pages'}
          </button>
          <button onClick={onReset} className="btn btn-secondary">
            New PDF
          </button>
        </div>
      </div>
    </div>
  )
}
