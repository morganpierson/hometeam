'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  DocumentArrowUpIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

export default function ResumeUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
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
    setSuccess(false)

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

      setSuccess(true)
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

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Resume</h2>

      <div
        onClick={handleClick}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isUploading
            ? 'border-amber-300 bg-amber-50'
            : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50/50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <>
            <ArrowPathIcon className="h-10 w-10 text-amber-500 mx-auto mb-3 animate-spin" />
            <p className="text-sm font-medium text-gray-900">Processing your resume...</p>
            <p className="text-xs text-gray-500 mt-1">This may take a moment</p>
          </>
        ) : success ? (
          <>
            <CheckCircleIcon className="h-10 w-10 text-green-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-900">Resume uploaded successfully!</p>
            <p className="text-xs text-gray-500 mt-1">Your profile has been updated</p>
          </>
        ) : (
          <>
            <DocumentArrowUpIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-900">Click to upload your resume</p>
            <p className="text-xs text-gray-500 mt-1">PDF format, max 10MB</p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
          <ExclamationCircleIcon className="h-5 w-5" />
          {error}
        </div>
      )}
    </div>
  )
}
