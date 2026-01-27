import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function FindWorkPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Find Work</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse job opportunities that match your skills
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-lg mb-4">
          <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Coming soon</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Job listings will appear here. You&apos;ll be able to browse and apply to opportunities that match your trade and experience.
        </p>
      </div>
    </div>
  )
}
