// FILE: hooks/use-data-table.ts
import { useState } from 'react'

// Define the shape of the parameters the hook will manage
interface DataTableParams {
  limit: number
  page: number
  search?: string
  // We can add sorting params later, e.g., sortBy?: string, sortOrder?: 'asc' | 'desc'
}

// Define the shape of the object the hook will return
interface UseDataTableReturn {
  listParams: DataTableParams
  apiParams: Omit<DataTableParams, 'search'> & { search?: string }
  handleSearch: (search: string | undefined) => void
  handlePageChange: (newPage: number) => void
  handlePageSizeChange: (newSize: number) => void
}

// Define the initial state for the hook
const initialState: DataTableParams = {
  limit: 10,
  page: 1,
  search: '',
}

export function useDataTable(): UseDataTableReturn {
  const [listParams, setListParams] = useState<DataTableParams>(initialState)

  const handleSearch = (search: string | undefined) => {
    setListParams((prevParams) => ({
      ...prevParams,
      search: search ?? '',
      page: 1, // Always reset to page 1 on a new search
    }))
  }

  const handlePageChange = (newPage: number) => {
    setListParams((prevParams) => ({
      ...prevParams,
      page: newPage,
    }))
  }

  const handlePageSizeChange = (newSize: number) => {
    setListParams((prevParams) => ({
      ...prevParams,
      limit: newSize,
      page: 1, // Always reset to page 1 when page size changes
    }))
  }

  // This computed object is what gets passed to the API query hook.
  // It intelligently removes the 'search' key if it's empty.
  const apiParams = {
    page: listParams.page,
    limit: listParams.limit,
    ...(listParams.search && { search: listParams.search }),
  }

  return {
    listParams,
    apiParams,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
  }
}
