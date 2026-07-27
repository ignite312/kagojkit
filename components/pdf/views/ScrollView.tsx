import ScrollPage from '@/components/pdf/page/ScrollPage'
import type { PageSizeMap, PdfDocument } from '@/types/pdf'

type ScrollViewProps = {
  pdfDoc: PdfDocument
  pages: number[]
  selectedPages: Set<number>
  rangeStart: number | null
  scrollSizes: PageSizeMap
  onPageClick: (pageNum: number) => void
}

export default function ScrollView({
  pdfDoc,
  pages,
  selectedPages,
  rangeStart,
  scrollSizes,
  onPageClick,
}: ScrollViewProps) {
  return (
    <div className="card p-0 max-w-4xl mx-auto">
      <div className="max-h-[80vh] overflow-y-auto p-6">
        {pages.map((pageNum) => (
          <ScrollPage
            key={pageNum}
            pdfDoc={pdfDoc}
            pageNum={pageNum}
            isSelected={selectedPages.has(pageNum)}
            isRangeStart={rangeStart === pageNum}
            onPageClick={onPageClick}
            scrollSize={scrollSizes[pageNum]}
          />
        ))}
      </div>
    </div>
  )
}
