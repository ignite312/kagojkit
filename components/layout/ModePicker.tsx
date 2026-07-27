'use client'

import type { AppMode, ModeOption } from '@/types/app'

const OPTIONS: ModeOption[] = [
  {
    id: 'extract',
    label: 'Extract pages',
    description: 'Pick pages from one PDF',
  },
  {
    id: 'merge-pdfs',
    label: 'Merge & arrange',
    description: 'Mix PDFs & images, reorder pages',
  },
  {
    id: 'images-to-pdf',
    label: 'Images → PDF',
    description: 'Turn photos into one PDF',
  },
]

type ModePickerProps = {
  mode: AppMode
  onChange: (mode: AppMode) => void
}

export default function ModePicker({ mode, onChange }: ModePickerProps) {
  return (
    <div className="mode-picker" role="tablist" aria-label="Tools">
      {OPTIONS.map((option) => {
        const active = mode === option.id
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={`mode-chip ${active ? 'is-active' : ''}`}
            onClick={() => onChange(option.id)}
          >
            <span className="mode-chip-label">{option.label}</span>
            <span className="mode-chip-desc">{option.description}</span>
          </button>
        )
      })}
    </div>
  )
}
