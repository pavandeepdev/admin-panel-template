import { useState } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// declare module '@tanstack/react-table' {
//   interface ColumnMeta<TData, TValue> {
//     className?: string
//     filterable?: boolean
//   }
// }

interface GlobalTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  totalCount: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  isPaginationEnabled?: boolean
  loading?: boolean
}

// declare module '@tanstack/react-table' {
//   interface ColumnMeta<TData, TValue> {
//     className?: string // We can pass a className for custom styling
//   }
// }

export function GlobalTable<TData>({
  data,
  columns,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isPaginationEnabled = true,
  loading = false,
}: Readonly<GlobalTableProps<TData>>) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const pagination: PaginationState = {
    pageIndex: currentPage > 0 ? currentPage - 1 : 0,
    pageSize,
  }

  const pageCount = pageSize > 0 ? Math.ceil((totalCount ?? 0) / pageSize) : 0

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    pageCount: pageCount,
  })

  return (
    <>
      <div className='overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700'>
        <Table>
          <TableHeader>
            {table?.getHeaderGroups()?.map((headerGroup) => (
              <TableRow
                key={headerGroup?.id}
                className='border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50'
              >
                {headerGroup?.headers?.map((header) => (
                  <TableHead
                    key={header?.id}
                    colSpan={header?.colSpan}
                    className={cn(
                      'px-4 py-3 font-semibold text-gray-700 dark:text-gray-200',
                      header.column.columnDef.meta?.className
                    )}
                  >
                    {header?.isPlaceholder
                      ? null
                      : flexRender(
                          header?.column?.columnDef?.header,
                          header?.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns?.length ?? 1}
                  className='h-24 text-center'
                >
                  <Loader2 className='mx-auto h-6 w-6 animate-spin text-gray-500' />
                </TableCell>
              </TableRow>
            ) : table?.getRowModel()?.rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row?.id}
                  data-state={row?.getIsSelected() && 'selected'}
                  className='border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50'
                >
                  {row?.getVisibleCells()?.map((cell) => (
                    <TableCell
                      key={cell?.id}
                      className={`px-4 py-3 ${
                        cell?.column?.columnDef?.meta?.className ?? ''
                      }`}
                    >
                      {flexRender(
                        cell?.column?.columnDef?.cell,
                        cell?.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns?.length ?? 1}
                  className='h-24 text-center text-gray-500 dark:text-gray-400'
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isPaginationEnabled && (totalCount ?? 0) > 0 && (
        <div className='flex flex-col items-center justify-between gap-4 py-3 sm:flex-row'>
          <div className='hidden sm:inline'>Total {totalCount} results</div>

          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <p className='text-sm font-medium'>Rows per page</p>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  onPageSizeChange(Number(value))
                }}
                disabled={loading}
              >
                <SelectTrigger className='h-9 w-[70px] border-gray-300 dark:border-gray-600'>
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side='top'>
                  {[10, 20, 30, 40, 50].map((pageSizeOption) => (
                    <SelectItem
                      key={pageSizeOption}
                      value={`${pageSizeOption}`}
                    >
                      {pageSizeOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='text-sm font-medium whitespace-nowrap ...'>
              Page {(table?.getState()?.pagination?.pageIndex ?? 0) + 1} of{' '}
              {table?.getPageCount() ?? 1}
              {/* Add total count for better context, hide on small screens to prevent clutter */}
            </div>
            <div className='flex items-center gap-1'>
              <Button
                variant='outline'
                size='icon'
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1 || loading}
                className='h-9 w-9 border-gray-300 dark:border-gray-600'
              >
                <DoubleArrowLeftIcon className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className='h-9 w-9 border-gray-300 dark:border-gray-600'
              >
                <ChevronLeftIcon className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= pageCount || loading}
                className='h-9 w-9 border-gray-300 dark:border-gray-600'
              >
                <ChevronRightIcon className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => onPageChange(pageCount)}
                disabled={currentPage >= pageCount || loading}
                className='h-9 w-9 border-gray-300 dark:border-gray-600'
              >
                <DoubleArrowRightIcon className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
