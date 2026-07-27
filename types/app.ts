export type AppMode = 'extract' | 'merge-pdfs' | 'images-to-pdf'

export type ModeOption = {
  id: AppMode
  label: string
  description: string
}
