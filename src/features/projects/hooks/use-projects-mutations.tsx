// FILE: src/features/jobs/hooks/use-job-mutations.ts
import { useCreateProject, useUpdateProject } from '../actions/projects.action';
import { TJobFormSchema } from '../schema/projects.schema'
import { JobForm } from '../types/projects.types'


/**
 * A "smart hook" for a dedicated page that encapsulates all business logic
 * for creating and updating Jobs. It handles data transformation and navigation.
 * @param jobId - The ID of the job to update (if in edit mode).
 */
export function useJobMutations(jobId?: string) {
  // Initialize the react-query mutation hooks, passing the onSuccess handler
  const { mutate: createMutate, isPending: isCreateLoading } =
    useCreateProject()
  const { mutate: updateMutate, isPending: isUpdateLoading } = useUpdateProject(
    jobId || ''
  )


  /**
   * Transforms form data into the API payload shape.
   */
  const createPayload = (values: TJobFormSchema): JobForm => {
    return {
      title: values.title,
      site_id: values.site_id,
      site_location_id: values.site_location_id,
      date: values.date_started.toISOString(),
      machine_id: values.machine_id,
      area_to_cover_ha: values.area_to_cover_ha,
      operator_id: values.operator_id,
      description: values.description || '',
      priority: values.priority,
      job_status: values.job_status,
      project_materials: values.materials,
    }
  }

  /**
   * Determines whether to call the create or update mutation.
   */
  const handleSubmit = (values: TJobFormSchema) => {
    const payload = createPayload(values)
    if (jobId) {
      updateMutate(payload, {
        onSuccess: () => {},
      })
    } else {
      createMutate(payload, {
        onSuccess: () => {},
      })
    }
  }

  return {
    handleSubmit,
    isLoading: isCreateLoading || isUpdateLoading,
  }
}