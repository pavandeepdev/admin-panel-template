
import instance from '@/config/instance/instance';
import {
  useMutation,
  UseMutationOptions,
  useQueryClient
} from '@tanstack/react-query';
import { toast } from 'sonner';

interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T;
  error?: boolean;
}

interface UsePostDataProps<TData, TVariables> {
  url: string;
  mutationOptions?: UseMutationOptions<TData, Error, TVariables>;
  headers?: Record<string, string>;
  refetchQueries?: string[];
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

const usePostData = <TData = unknown, TVariables = unknown>({
  url,
  mutationOptions,
  headers = {},
  refetchQueries,
  onSuccess = () => { },
  onError = () => { }
}: UsePostDataProps<TData, TVariables>) => {
  const queryClient = useQueryClient();


  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await instance.post<ApiResponse<TData>>({
        url,
        data: variables,
        headers
      });

      if (response?.statusCode === 200 || response?.statusCode === 201) {
        toast(response?.message || 'Data posted successfully');
        return response.data.data; // Extracting only the data field
      }

      if (response?.statusCode === 400) {
        throw Object.assign(new Error(response?.message || 'Bad Request'), {
          statusCode: 400
        });
      }
      throw new Error(response?.message || 'Failed to post data');
    },
    onSuccess: (data) => {
      if (refetchQueries) {
        refetchQueries.forEach((queryKey) => {
          queryClient.refetchQueries({ queryKey: [queryKey] });
        });
        onSuccess(data);
      }
    },
    onError: (error: Error) => {
      if (error.message.includes('Bad Request')) {
        toast.error('Bad Request: ' + error.message);
      } else if (error.message.includes('Unauthorized')) {
        toast.error('Unauthorized: ' + error.message);
      } else {
        toast.error('Error: ' + error.message);
      }
      onError(error);
    },
    ...mutationOptions
  });
};

export default usePostData;