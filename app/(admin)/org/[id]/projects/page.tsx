import ProjectsListPage from '@/app/components/projects-list-page'
import { fetchProjectData } from '@/utils/actions'

const ProjectsPage = async ({ params }) => {
  console.log('PARAMS', params)
  const projects = await fetchProjectData(params.id)
  console.log('PROJECTS', projects)
  return (
    <div>
      <h1 className="text-3xl font-sans tracking-widest font-semibold mb-8">
        Projects & Contributors
      </h1>
      <div className="flex justify-center">
        <ProjectsListPage projects={projects} />
      </div>
    </div>
  )
}

export default ProjectsPage
