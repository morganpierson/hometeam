import ProjectsListPage from '@/app/components/projects-list-page'

const ProjectsPage = async ({ params }) => {
  console.log('PARAMS', params)
  // const projects = await fetchProjectData(params.id)
  return (
    <div>
      <h1 className="text-3xl font-sans tracking-widest font-semibold mb-8">
        My Saved Candidates
      </h1>
      <div className="flex justify-center">My Saved Candidates</div>
    </div>
  )
}

export default ProjectsPage
