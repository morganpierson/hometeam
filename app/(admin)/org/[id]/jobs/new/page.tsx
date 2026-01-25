import { fetchEmployerData } from '@/utils/actions'
import { redirect } from 'next/navigation'
import JobPostingForm from '@/app/components/jobs/job-posting-form'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface NewJobPageProps {
  params: { id: string }
}

export default async function NewJobPage({ params }: NewJobPageProps) {
  const employerData = await fetchEmployerData()

  if (!employerData) {
    redirect('/new-user')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/org/${params.id}/jobs`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Jobs
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Post a New Job</h1>
          <p className="text-gray-600 mt-1">
            Create a job posting to find qualified trade professionals.
          </p>
        </div>

        {/* Form */}
        <JobPostingForm employer={employerData} orgId={params.id} />
      </div>
    </div>
  )
}
