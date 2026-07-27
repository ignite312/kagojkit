import { PDFDocument } from 'pdf-lib'
import type { ComposePage } from '@/types/compose'

const A4_WIDTH = 595.28
const A4_HEIGHT = 841.89

async function fileToImageBytes(file: File): Promise<{
  bytes: ArrayBuffer
  kind: 'jpg' | 'png'
}> {
  const type = file.type.toLowerCase()

  if (type === 'image/jpeg' || type === 'image/jpg') {
    return { bytes: await file.arrayBuffer(), kind: 'jpg' }
  }

  if (type === 'image/png') {
    return { bytes: await file.arrayBuffer(), kind: 'png' }
  }

  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth || img.width
    canvas.height = img.naturalHeight || img.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not process image')
    ctx.drawImage(img, 0, 0)
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Image conversion failed'))),
        'image/png'
      )
    })
    return { bytes: await blob.arrayBuffer(), kind: 'png' }
  } finally {
    URL.revokeObjectURL(url)
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = src
  })
}

function fileKey(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`
}

async function appendImagePage(pdf: PDFDocument, file: File) {
  const { bytes, kind } = await fileToImageBytes(file)
  const image =
    kind === 'jpg' ? await pdf.embedJpg(bytes) : await pdf.embedPng(bytes)

  const { width, height } = image.scale(1)
  const margin = 36
  const maxW = A4_WIDTH - margin * 2
  const maxH = A4_HEIGHT - margin * 2
  const scale = Math.min(maxW / width, maxH / height, 1)
  const drawW = width * scale
  const drawH = height * scale
  const x = (A4_WIDTH - drawW) / 2
  const y = (A4_HEIGHT - drawH) / 2

  const page = pdf.addPage([A4_WIDTH, A4_HEIGHT])
  page.drawImage(image, { x, y, width: drawW, height: drawH })
}

/** Build one PDF from an ordered mix of PDF pages and images. */
export async function composePagesToBlob(
  pages: ComposePage[]
): Promise<{ blob: Blob; pageCount: number }> {
  if (pages.length === 0) {
    throw new Error('Add at least one page')
  }

  const output = await PDFDocument.create()
  const pdfCache = new Map<string, PDFDocument>()

  for (const item of pages) {
    if (item.kind === 'image') {
      await appendImagePage(output, item.file)
      continue
    }

    const key = fileKey(item.file)
    let source = pdfCache.get(key)
    if (!source) {
      source = await PDFDocument.load(await item.file.arrayBuffer())
      pdfCache.set(key, source)
    }

    const [copied] = await output.copyPages(source, [item.pageNumber - 1])
    output.addPage(copied)
  }

  const bytes = await output.save()
  return {
    blob: new Blob([bytes as BlobPart], { type: 'application/pdf' }),
    pageCount: pages.length,
  }
}

export { fileToImageBytes, appendImagePage }
