import { api } from '@/trpc/react'
import React from 'react'
import {useLocalStorage} from 'usehooks-ts'


const useProject = () => {
  
const {data: projects} = api.project.getProject.useQuery() 
    
const [projectId, setProjectId] = useLocalStorage('codeatlas-projectId','')

const project =
  projects?.find((p) => p.id === projectId) ??
  projects?.[0];

  return {
    projects,
    project,
    projectId,
    setProjectId,
  }
}

export default useProject;
