import { PDFDocument } from 'pdf-lib'

export async function mergePdfsToBlob(
  files: File[]
): Promise<{ blob: Blob; pageCount: number }> {
  if (files.length < 2) {
    throw new Error('Add at least two PDFs to merge')
  }

  const merged = await PDFDocument.create()
  let pageCount = 0

  for (const file of files) {
    const bytes = await file.arrayBuffer()
    const source = await PDFDocument.load(bytes)
    const indices = source.getPageIndices()
    const copied = await merged.copyPages(source, indices)
    copied.forEach((page) => merged.addPage(page))
    pageCount += indices.length
  }

  const output = await merged.save()
  return {
    blob: new Blob([output as BlobPart], { type: 'application/pdf' }),
    pageCount,
  }
}
