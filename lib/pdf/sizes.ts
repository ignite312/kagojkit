import type { PageSizeMap, PdfDocument } from '@/types/pdf'

export async function computePageSizes(
  pdfDoc: PdfDocument,
  thumbScale = 0.6,
  scrollScale = 1.2
) {
  const thumbMap: PageSizeMap = {}
  const scrollMap: PageSizeMap = {}

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    try {
      const page = await pdfDoc.getPage(i)
      const thumbViewport = page.getViewport({ scale: thumbScale })
      const scrollViewport = page.getViewport({ scale: scrollScale })
      thumbMap[i] = {
        width: Math.round(thumbViewport.width),
        height: Math.round(thumbViewport.height),
      }
      scrollMap[i] = {
        width: Math.round(scrollViewport.width),
        height: Math.round(scrollViewport.height),
      }
    } catch {
      // skip individual page errors
    }
  }

  return { thumbMap, scrollMap }
}
