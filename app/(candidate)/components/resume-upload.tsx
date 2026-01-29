'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  SparklesIcon,
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
    <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="p-2 bg-violet-100 rounded-lg">
            <SparklesIcon className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Update Resume with AI</h2>
            <p className="text-xs text-gray-500">
              Upload a new resume to refresh your profile
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />

          {success ? (
            <div className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2 px-3 py-2 bg-white border border-green-200 rounded-lg flex-1">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Resume updated successfully</span>
              </div>
              <button
                type="button"
                onClick={handleClick}
                disabled={isUploading}
                className="px-4 py-2 text-sm font-medium text-violet-700 bg-white border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors"
              >
                Upload Another
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleClick}
              disabled={isUploading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {isUploading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  Processing resume...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4" />
                  Upload Resume (PDF)
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
          <ExclamationCircleIcon className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}
