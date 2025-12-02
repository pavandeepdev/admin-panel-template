// FILE: src/hooks/use-fetch-details.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import instance from '@/config/instance/instance'

/**
 * Interface for the props of the useFetchDetails hook.
 * @template TData The expected type of the successfully fetched data.
 */
interface UseFetchDetailsProps<TData> {
  /** The base URL for the API endpoint (e.g., '/api/v1/project/detail'). */
  url: string
  /** The unique identifier of the resource to fetch. */
  id: string | undefined
  /** Optional options to pass to the underlying useQuery hook. */
  queryOptions?: Omit<
    UseQueryOptions<TData, Error, TData>,
    'queryKey' | 'queryFn'
  >
  /** Determines if the query should be enabled. Defaults to `!!id`. */
  enabled?: boolean
}

/**
 * A generic custom hook to fetch a single resource by its ID using TanStack Query.
 *
 * @template TData The expected type of the API response data.
 * @param {UseFetchDetailsProps<TData>} props The properties for the hook.
 * @returns The result object from `useQuery`.
 *
 * @example
 * // Fetch a project with a specific ID
 * const { data: projectData, isLoading } = useFetchDetails({
 *   url: '/api/v1/project/detail',
 *   id: projectId, // Comes from URL params, for example
 * });
 */
const useFetchDetails = <TData = unknown,>({
  url,
  id,
  queryOptions = {},
  enabled,
}: UseFetchDetailsProps<TData>) => {
  return useQuery<TData, Error>({
    // The query key is an array that uniquely identifies this query.
    // Including the ID ensures that fetching different items are cached separately.
    queryKey: [url, id],

    queryFn: async (): Promise<TData> => {
      const response = await instance.get({
        // Construct the final URL with the ID
        url: `${url}/${id}`,
      })
      if (response?.statusCode === 200) {
        return response.data as TData
      }
      // Throw an error to let react-query handle the error state
      throw new Error(response?.message || 'Failed to fetch details')
    },

    // A crucial setting: the query will only run if `enabled` is true.
    // We default this to `!!id`, so it won't run if the ID is null or undefined.
    enabled: enabled ?? !!id,

    // Sensible defaults for detail queries
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Stale after 5 minutes
    ...queryOptions,
  })
}

export default useFetchDetails
