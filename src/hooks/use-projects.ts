import { api } from '@/trpc/react'
import React, { useEffect } from 'react'
import {useLocalStorage} from 'usehooks-ts'


const useProject = () => {
  
const {data: projects, isLoading} = api.project.getProjects.useQuery() 
    
const [projectId, setProjectId] = useLocalStorage('codeatlas-projectId','')

const project =
  projects?.find((p) => p.id === projectId) ??
  projects?.[0];

  useEffect(() => {
    if (project && projectId !== project.id) {
      setProjectId(project.id)
    }
  }, [project, projectId, setProjectId])

  return {
    projects,
    project,
    projectId: project?.id ?? '',
    setProjectId,
    isLoading
  }
}

export default useProject;
