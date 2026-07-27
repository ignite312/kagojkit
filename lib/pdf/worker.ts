import * as pdfjsLib from 'pdfjs-dist'

const PDFJS_WORKER_VERSION = '3.11.174'

export function configurePdfWorker() {
  if (typeof window === 'undefined') return
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_WORKER_VERSION}/pdf.worker.min.js`
}

export { pdfjsLib }
