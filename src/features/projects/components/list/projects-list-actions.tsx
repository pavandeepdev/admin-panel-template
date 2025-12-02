import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProjectStore } from '../../store/projects.store'
import { Project } from '../../types/projects.types'

interface Props {
  project: Project
}

/**
 * Renders direct "Edit" and "Delete" buttons for a project/job row.
 */
export function ProjectListActions({ project }: Props) {
  const { setOpen, setCurrentRow } = useProjectStore()

  const handleEdit = () => {}

  const handleDelete = () => {
    setCurrentRow(project)
    setOpen('delete')
  }

  return (
    <div className='flex items-center justify-start gap-2'>
      <Button
        variant='outline'
        size='icon'
        className='h-8 w-8'
        onClick={handleEdit}
      >
        <span className='sr-only'>Edit Job</span>
        <Pencil className='h-4 w-4' />
      </Button>

      <Button
        variant='outline'
        size='icon'
        className='h-8 w-8 text-red-600 hover:text-red-700 focus:ring-red-500'
        onClick={handleDelete}
      >
        <span className='sr-only'>Delete Job</span>
        <Trash2 className='h-4 w-4' />
      </Button>
    </div>
  )
}
