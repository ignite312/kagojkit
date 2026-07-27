'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import PDFViewer from '@/components/pdf/PDFViewer'
import UploadSection from '@/components/upload/UploadSection'

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <Header />

        {!pdfFile ? (
          <UploadSection onFileSelect={setPdfFile} />
        ) : (
          <PDFViewer pdfFile={pdfFile} onReset={() => setPdfFile(null)} />
        )}
      </div>
    </div>
  )
}
