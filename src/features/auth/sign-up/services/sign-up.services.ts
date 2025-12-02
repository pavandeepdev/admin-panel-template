import API from '@/config/api/api'
import useFetchData from '@/hooks/api/use-fetch-data'
import usePostData from '@/hooks/api/use-post-data'

export const useLogin = () => {
  return usePostData({
    url: API.auth.login,
    refetchQueries: [API.auth.profile],
  })
}

export const useGetProfile = () => {
  return useFetchData({
    url: API.auth.profile,
  })
}
