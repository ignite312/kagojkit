'use client'

import { useState } from 'react'

interface UploadSectionProps {
  onFileSelect: (file: File) => void
}

export default function UploadSection({ onFileSelect }: UploadSectionProps) {
  const [dragging, setDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      onFileSelect(file)
    } else {
      alert('Please upload a PDF file')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div className="card p-8">
      <div
        className={`upload-area ${dragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6c757d"
          strokeWidth="2"
          className="mx-auto mb-4"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload PDF File
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Drag and drop or click to browse
        </p>
        <input
          type="file"
          id="fileInput"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="btn btn-primary pointer-events-none">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Choose File
        </span>
        <p className="text-gray-400 text-xs mt-4">Maximum file size: 50MB</p>
      </div>
    </div>
  )
}
