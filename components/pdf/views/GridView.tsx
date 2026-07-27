import PageThumbnail from '@/components/pdf/page/PageThumbnail'
import type { PageSizeMap, PdfDocument } from '@/types/pdf'

type GridViewProps = {
  pdfDoc: PdfDocument
  pages: number[]
  selectedPages: Set<number>
  rangeStart: number | null
  thumbSizes: PageSizeMap
  onPageClick: (pageNum: number) => void
  onDoubleClick: (pageNum: number) => void
}

export default function GridView({
  pdfDoc,
  pages,
  selectedPages,
  rangeStart,
  thumbSizes,
  onPageClick,
  onDoubleClick,
}: GridViewProps) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}
    >
      {pages.map((pageNum) => (
        <PageThumbnail
          key={pageNum}
          pdfDoc={pdfDoc}
          pageNum={pageNum}
          isSelected={selectedPages.has(pageNum)}
          isRangeStart={rangeStart === pageNum}
          onPageClick={onPageClick}
          onDoubleClick={onDoubleClick}
          thumbSize={thumbSizes[pageNum]}
        />
      ))}
    </div>
  )
}
