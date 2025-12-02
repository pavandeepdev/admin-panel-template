

import { ColumnDef } from '@tanstack/react-table'

import { Project } from '../../types/projects.types'
import { ProjectListActions } from './projects-list-actions'



export const columns: ColumnDef<Project>[] = [
  {
    id: 'serialNumber',
    header: 'S.No.',
    cell: ({ row, table }) =>
      table.getState().pagination.pageIndex *
        table.getState().pagination.pageSize +
      row.index +
      1,
    meta: { className: 'text-center w-[5%]' },
  },
  {
    accessorKey: 'project_code',
    header: 'Job Id',
    meta: { className: 'w-[10%]' },
  },
  {
    accessorKey: 'title',
    header: 'Job TItle',
    // This column is flexible
  },
  {
    accessorKey: 'site.site_name',
    header: 'Site',
    cell: ({ row }) => row.original.site?.site_name || 'N/A',
    meta: { className: 'w-[15%]' },
  },
  // HIGHLIGHT: Add the new Site Location column
  {
    accessorKey: 'site_location.site_location_name',
    header: 'Location',
    cell: ({ row }) => row.original.site_location?.site_location_name || 'N/A',
    meta: { className: 'w-[15%]' },
  },
  {
    accessorKey: 'operator.name',
    header: 'Operator',
    cell: ({ row }) => row.original.operator?.name || 'N/A',
    meta: { className: 'w-[15%]' },
  },

  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'))
      return <div className='font-medium'>{date.toDateString()}</div>
    },
    meta: { className: 'w-[10%]' },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ProjectListActions project={row.original} />,
    enableSorting: false,
    enableHiding: false,
    meta: { className: 'w-[10%]' },
  },
]
