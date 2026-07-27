import { PDFDocument } from 'pdf-lib'

export async function extractPagesToBlob(
  pdfFile: File,
  selectedPages: Iterable<number>
): Promise<{ blob: Blob; pageCount: number }> {
  const sorted = Array.from(selectedPages).sort((a, b) => a - b)
  if (sorted.length === 0) {
    throw new Error('Select at least one page')
  }

  const sourceBytes = await pdfFile.arrayBuffer()
  const source = await PDFDocument.load(sourceBytes)
  const destination = await PDFDocument.create()

  for (const pageNum of sorted) {
    const [copied] = await destination.copyPages(source, [pageNum - 1])
    destination.addPage(copied)
  }

  const bytes = await destination.save()
  const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' })
  return { blob, pageCount: sorted.length }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
