import API from '@/config/api/api';
import useDeleteData from '@/hooks/api/use-delete-data';
import useFetchData from '@/hooks/api/use-fetch-data';
import useFetchDetails from '@/hooks/api/use-fetch-details-data';
import usePatchData from '@/hooks/api/use-patch-data';
import usePostData from '@/hooks/api/use-post-data'
import { ProjectsResponse } from '../types/projects.types'


const LIST_URL = API.projects.list

export const useGetProjects = (params?: any) => {
  return useFetchData<ProjectsResponse>({ url: LIST_URL, params })
}

export const useCreateProject = () => {
  return usePostData({  
    url: API.projects.add,
    refetchQueries: [LIST_URL],
  })
}

export const useUpdateProject = (id: string) => {
  return usePatchData({
    url: `${API.projects.update}/${id}`,
    refetchQueries: [LIST_URL],
  })
}

export const useDeleteProject = (id: string) => {
  return useDeleteData({
    url: `${API.projects.delete}/${id}`,
    refetchQueries: [LIST_URL],
  })
}



export const useGetProjectById = (
  id: string | undefined,
  config: {
    enabled?: boolean
  }
) => {
  return useFetchDetails<any>({
    url: API.projects.detail,
    id,
    enabled: config.enabled,
  })
}