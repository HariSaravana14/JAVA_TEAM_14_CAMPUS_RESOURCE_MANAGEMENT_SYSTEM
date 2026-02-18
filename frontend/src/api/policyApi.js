import { axiosInstance } from './axiosInstance'

export async function getPolicyRemaining() {
  const { data } = await axiosInstance.get('/api/policy/remaining')
  return data
}
