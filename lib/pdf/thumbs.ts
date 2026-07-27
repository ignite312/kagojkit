import { configurePdfWorker, pdfjsLib } from '@/lib/pdf/worker'

configurePdfWorker()

type LoadedPdf = Awaited<ReturnType<typeof pdfjsLib.getDocument>['promise']>

export async function loadPdfDocument(file: File): Promise<LoadedPdf> {
  const data = await file.arrayBuffer()
  return pdfjsLib.getDocument({ data }).promise
}

export async function renderPageThumbFromDoc(
  pdf: LoadedPdf,
  pageNumber: number,
  scale = 0.35
): Promise<string | null> {
  try {
    const page = await pdf.getPage(pageNumber)
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const context = canvas.getContext('2d')
    if (!context) return null
    await page.render({ canvasContext: context, viewport }).promise
    return canvas.toDataURL('image/jpeg', 0.72)
  } catch (err) {
    console.error('Thumb render failed', err)
    return null
  }
}

/** Render a single PDF page to a small data-URL thumbnail. */
export async function renderPdfPageThumb(
  file: File,
  pageNumber: number,
  scale = 0.35
): Promise<string | null> {
  try {
    const pdf = await loadPdfDocument(file)
    return renderPageThumbFromDoc(pdf, pageNumber, scale)
  } catch (err) {
    console.error('Thumb render failed', err)
    return null
  }
}

export async function getPdfPageCount(file: File): Promise<number> {
  const pdf = await loadPdfDocument(file)
  return pdf.numPages
}
