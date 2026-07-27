import FullPageCanvas from '@/components/pdf/page/FullPageCanvas'
import type { PdfDocument } from '@/types/pdf'

type FullPagePreviewModalProps = {
  pdfDoc: PdfDocument
  pageNum: number
  totalPages: number
  onClose: () => void
}

export default function FullPagePreviewModal({
  pdfDoc,
  pageNum,
  totalPages,
  onClose,
}: FullPagePreviewModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-auto"
      onClick={onClose}
    >
      <div
        className="min-h-screen flex flex-col items-center justify-start py-6 px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-5xl mb-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white text-xl font-semibold">
              Page {pageNum} of {totalPages}
            </h3>
            <button onClick={onClose} className="text-white hover:text-gray-300">
              Close
            </button>
          </div>
        </div>
        <div className="w-full max-w-5xl">
          <FullPageCanvas pdfDoc={pdfDoc} pageNum={pageNum} />
        </div>
      </div>
    </div>
  )
}
