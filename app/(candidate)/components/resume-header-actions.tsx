'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  DocumentTextIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

interface ResumeHeaderActionsProps {
  resumeUrl: string
}

export default function ResumeHeaderActions({ resumeUrl }: ResumeHeaderActionsProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch('/api/resume', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload resume')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex items-center gap-3 mt-1">
      <Link
        href={resumeUrl}
        target="_blank"
        className="inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700"
      >
        <DocumentTextIcon className="h-4 w-4" />
        View Resume
      </Link>
      <span className="text-gray-300">|</span>
      <button
        onClick={handleUploadClick}
        disabled={isUploading}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
      >
        {isUploading ? (
          <>
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload new resume'
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      {error && (
        <span className="text-sm text-red-600">{error}</span>
      )}
    </div>
  )
}
