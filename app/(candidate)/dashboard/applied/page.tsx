import { DocumentTextIcon } from '@heroicons/react/24/outline'

export default function AppliedPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Applied</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your job applications
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-lg mb-4">
          <DocumentTextIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          When you apply to jobs, you&apos;ll be able to track your applications and their status here.
        </p>
      </div>
    </div>
  )
}
