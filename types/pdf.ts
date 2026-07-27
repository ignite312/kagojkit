export type ViewMode = 'grid' | 'scroll'

export type PageSize = {
  width: number
  height: number
}

export type PageSizeMap = Record<number, PageSize>

/** PDF.js document proxy — typed loosely to avoid hard coupling to pdfjs-dist internals */
export type PdfDocument = {
  numPages: number
  getPage: (pageNumber: number) => Promise<PdfPage>
}

export type PdfPage = {
  getViewport: (params: { scale: number }) => { width: number; height: number }
  render: (params: {
    canvasContext: CanvasRenderingContext2D
    viewport: { width: number; height: number }
  }) => { promise: Promise<void>; cancel: () => void }
}
