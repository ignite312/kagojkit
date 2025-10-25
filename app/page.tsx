'use client'

import { useState } from 'react'
import PDFViewer from '@/components/PDFViewer'
import UploadSection from '@/components/UploadSection'

export default function Home() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileSelect = (file: File) => {
    setLoading(true)
    setPdfFile(file)
    setTimeout(() => setLoading(false), 500)
  }

  const handleReset = () => {
    setPdfFile(null)
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="py-8 border-b border-gray-300 mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">
            PDF Page Selector
          </h1>
          <p className="text-gray-600 text-base">
            Select and extract specific pages from your PDF documents
          </p>
        </header>

        {/* Main Content */}
        {!pdfFile ? (
          <UploadSection onFileSelect={handleFileSelect} />
        ) : loading ? (
          <div className="card p-16 text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Loading PDF...</p>
          </div>
        ) : (
          <PDFViewer pdfFile={pdfFile} onReset={handleReset} />
        )}
      </div>
    </div>
  )
}
