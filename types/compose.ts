export type ComposePageKind = 'pdf' | 'image'

type ComposePageBase = {
  id: string
  label: string
  sourceName: string
  sourceKey: string
  previewUrl: string | null
}

export type ComposePdfPage = ComposePageBase & {
  kind: 'pdf'
  file: File
  pageNumber: number
}

export type ComposeImagePage = ComposePageBase & {
  kind: 'image'
  file: File
}

export type ComposePage = ComposePdfPage | ComposeImagePage
