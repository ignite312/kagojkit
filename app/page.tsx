'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import ModePicker from '@/components/layout/ModePicker'
import PDFViewer from '@/components/pdf/PDFViewer'
import ExtractUpload from '@/components/upload/ExtractUpload'
import MergePdfsWorkspace from '@/components/merge/MergePdfsWorkspace'
import ImagesToPdfWorkspace from '@/components/merge/ImagesToPdfWorkspace'
import type { AppMode } from '@/types/app'

export default function Home() {
  const [mode, setMode] = useState<AppMode>('extract')
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  const changeMode = (next: AppMode) => {
    setMode(next)
    setPdfFile(null)
  }

  return (
    <div className="app-shell">
      <div className="app-frame">
        <Header />
        <ModePicker mode={mode} onChange={changeMode} />

        {mode === 'extract' &&
          (pdfFile ? (
            <PDFViewer pdfFile={pdfFile} onReset={() => setPdfFile(null)} />
          ) : (
            <ExtractUpload onFileSelect={setPdfFile} />
          ))}

        {mode === 'merge-pdfs' && <MergePdfsWorkspace />}
        {mode === 'images-to-pdf' && <ImagesToPdfWorkspace />}
      </div>
    </div>
  )
}
