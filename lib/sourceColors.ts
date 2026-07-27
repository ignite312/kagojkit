export type SourceColorScheme = {
  id: string
  accent: string
  soft: string
  ink: string
  label: string
  kind: 'pdf' | 'image'
  /** Color palette index within kind */
  index: number
  /** Overall serial position among all sources (0-based) */
  serial: number
  pageCount: number
}

type PaletteColor = Omit<
  SourceColorScheme,
  'id' | 'label' | 'kind' | 'index' | 'serial' | 'pageCount'
>

/** Distinct cool tones — one unique color per PDF source */
const PDF_SCHEMES: PaletteColor[] = [
  { accent: '#0f766e', soft: '#d7f3ef', ink: '#0b4f4a' },
  { accent: '#1d4ed8', soft: '#dbe7ff', ink: '#1e3a8a' },
  { accent: '#0369a1', soft: '#d7effc', ink: '#0c4a6e' },
  { accent: '#15803d', soft: '#dcfce7', ink: '#166534' },
  { accent: '#0e7490', soft: '#cff4fc', ink: '#155e75' },
  { accent: '#4338ca', soft: '#e0e7ff', ink: '#312e81' },
  { accent: '#475569', soft: '#e2e8f0', ink: '#1e293b' },
  { accent: '#0f766e', soft: '#ccfbf1', ink: '#115e59' },
  { accent: '#1e40af', soft: '#bfdbfe', ink: '#1e3a8a' },
  { accent: '#155e75', soft: '#a5f3fc', ink: '#164e63' },
  { accent: '#047857', soft: '#a7f3d0', ink: '#065f46' },
  { accent: '#1e3a8a', soft: '#c7d2fe', ink: '#172554' },
]

/** Distinct warm tones — one unique color per image source */
const IMAGE_SCHEMES: PaletteColor[] = [
  { accent: '#c2410c', soft: '#ffedd5', ink: '#9a3412' },
  { accent: '#b45309', soft: '#fef3c7', ink: '#92400e' },
  { accent: '#be123c', soft: '#ffe4e6', ink: '#9f1239' },
  { accent: '#a16207', soft: '#fef9c3', ink: '#854d0e' },
  { accent: '#9a3412', soft: '#fed7aa', ink: '#7c2d12' },
  { accent: '#b91c1c', soft: '#fee2e2', ink: '#991b1b' },
  { accent: '#c026d3', soft: '#fae8ff', ink: '#a21caf' },
  { accent: '#ca8a04', soft: '#fef08a', ink: '#a16207' },
  { accent: '#ea580c', soft: '#ffedd5', ink: '#c2410c' },
  { accent: '#e11d48', soft: '#fecdd3', ink: '#be123c' },
  { accent: '#d97706', soft: '#fde68a', ink: '#b45309' },
  { accent: '#dc2626', soft: '#fecaca', ink: '#b91c1c' },
]

export function sourceFileKey(kind: 'pdf' | 'image', file: File): string {
  return `${kind}:${file.name}:${file.size}:${file.lastModified}`
}

type SourceLike = {
  kind: 'pdf' | 'image'
  sourceKey: string
  sourceName: string
}

/**
 * Assign a separate color to every unique source, in document serial order.
 */
export function assignSourceColorSchemes(
  pages: SourceLike[]
): Map<string, SourceColorScheme> {
  const schemes = new Map<string, SourceColorScheme>()
  let pdfIndex = 0
  let imageIndex = 0
  let serial = 0

  for (const page of pages) {
    const existing = schemes.get(page.sourceKey)
    if (existing) {
      existing.pageCount += 1
      continue
    }

    const isPdf = page.kind === 'pdf'
    const palette = isPdf ? PDF_SCHEMES : IMAGE_SCHEMES
    const index = isPdf ? pdfIndex++ : imageIndex++
    const colors = palette[index % palette.length]

    schemes.set(page.sourceKey, {
      id: page.sourceKey,
      label: page.sourceName,
      kind: page.kind,
      index,
      serial: serial++,
      pageCount: 1,
      ...colors,
    })
  }

  return schemes
}
