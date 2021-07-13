import { useQuery, useQueryClient, useMutation } from 'react-query'
import axios from 'axios'

const getEmailListById = async (id) => {
  const { data } = await axios.get(`/lists/${id}`)
  return data
}
const getEmailLists = async () => {
  const { data } = await axios.get('/lists')
  return data
}
const addEmailList = async (name) => {
  const { data } = await axios.post(`lists`, { name, addresses: [] })
  return data
}
const updateEmailList = async (list) => {
  const { data } = await axios.put(`lists/${list.id}`, list)
  return data
}
const removeEmailList = async (id) => {
  await axios.delete(`/lists/${id}`)
}

export function useEmailList(id) {
  return useQuery(['lists', id], () => getEmailListById(id))
}
export function useEmailLists() {
  return useQuery('lists', getEmailLists)
}
export function useAddEmailList() {
  const queryClient = useQueryClient()

  return useMutation(addEmailList, {
    onSuccess: (newList) => {
      queryClient.setQueryData(['lists'], (lists) => [...lists, newList])
    },
  })
}
export function useUpdateEmailList() {
  const queryClient = useQueryClient()

  return useMutation(updateEmailList, {
    onSuccess: (_, vars) => {
      queryClient.setQueryData(['lists', vars.id], () => vars)
    },
  })
}
export function useRemoveEmailList() {
  const queryClient = useQueryClient()

  return useMutation(removeEmailList, {
    onSuccess: (_, vars) => {
      queryClient.setQueryData(['lists'], (lists) =>
        lists.filter((list) => list.id !== vars)
      )
    },
  })
}
