import { PDFDocument } from 'pdf-lib'
import { appendImagePage } from './compose'

export async function imagesToPdfBlob(
  files: File[]
): Promise<{ blob: Blob; pageCount: number }> {
  if (files.length === 0) {
    throw new Error('Add at least one image')
  }

  const pdf = await PDFDocument.create()
  for (const file of files) {
    await appendImagePage(pdf, file)
  }

  const output = await pdf.save()
  return {
    blob: new Blob([output as BlobPart], { type: 'application/pdf' }),
    pageCount: files.length,
  }
}
