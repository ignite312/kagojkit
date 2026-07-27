'use client'

import DropZone from '@/components/upload/DropZone'
import { isPdfFile } from '@/lib/files'

type ExtractUploadProps = {
  onFileSelect: (file: File) => void
}

export default function ExtractUpload({ onFileSelect }: ExtractUploadProps) {
  return (
    <section className="workspace">
      <div className="workspace-intro">
        <h2>Extract pages</h2>
        <p>Upload a PDF, select pages, download a new file.</p>
      </div>
      <DropZone
        accept="application/pdf,.pdf"
        title="Drop a PDF here"
        hint="or click to browse · max 50MB"
        filter={isPdfFile}
        invalidMessage="Please upload a PDF file."
        onFiles={(files) => onFileSelect(files[0])}
      />
    </section>
  )
}
