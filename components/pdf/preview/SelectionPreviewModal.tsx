import { findRanges } from '@/lib/pdf'

type SelectionPreviewModalProps = {
  selectedPages: number[]
  onClose: () => void
}

export default function SelectionPreviewModal({
  selectedPages,
  onClose,
}: SelectionPreviewModalProps) {
  const ranges = findRanges(selectedPages)

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 p-6 overflow-auto"
      onClick={onClose}
    >
      <div className="card max-w-3xl mx-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Selected Pages Preview</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            Close
          </button>
        </div>
        <div className="border-t border-gray-300 my-4" />
        <p className="text-gray-600 text-sm mb-3">
          You have selected <strong>{selectedPages.length}</strong> page(s):
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedPages.map((pageNum) => (
            <span key={pageNum} className="badge badge-primary px-3 py-2 text-sm">
              {pageNum}
            </span>
          ))}
        </div>
        {ranges.length > 0 && (
          <div>
            <p className="text-gray-600 text-sm mb-3">
              <strong>Page Ranges:</strong>
            </p>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              {ranges.join(', ')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
