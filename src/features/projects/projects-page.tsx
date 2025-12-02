import { useDataTable } from '@/hooks/table/use-data-table';
import { GlobalTable } from '@/components/table/global-table';
import GlobalFilterSection from '@/components/table/global-table-filter';
import TablePageHeader from '@/components/table/table-page-header';
import { FilterConfig } from '@/components/table/table-toolbar';
import { useGetProjects } from './actions/projects.action';
import { columns } from './components/list/projects-list-columns'
import { ProjectsResponse } from './types/projects.types'


const ProjectsPage = () => {
  const {
    listParams,
    apiParams,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
  } = useDataTable()

  const { data: listData, isLoading: loading } = useGetProjects(apiParams)
  const tableData = (listData as ProjectsResponse)?.docs ?? []
  const totalCount = (listData as ProjectsResponse)?.count ?? 0
  const filters: FilterConfig[] = [
    {
      type: 'search',
      placeholder: 'Search by job title...',
      key: 'search',
      value: listParams.search,
      onChange: handleSearch,
    },
  ]

  return (
    <div>
      <TablePageHeader
        title='Jobs'
        buttonText='Add Job'
        onButtonClick={() => {}}
      >
        Manage and track all ongoing and completed jobs.
      </TablePageHeader>

      <GlobalFilterSection filters={filters} />

      <GlobalTable
        columns={columns}
        data={tableData}
        loading={loading}
        totalCount={totalCount}
        currentPage={listParams.page}
        pageSize={listParams.limit}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isPaginationEnabled
      />
    </div>

  )
}

export default ProjectsPage