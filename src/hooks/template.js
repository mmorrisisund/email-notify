import { useMutation, useQuery, useQueryClient } from 'react-query'
import axios from 'axios'

const getTemplates = async () => {
  const { data } = await axios.get('/templates')
  return data
}

const getTemplateById = async (id) => {
  const { data } = await axios.get(`/templates/${id}`)
  return data
}

const addTemplate = async (template) => {
  const { data } = await axios.post('/templates', template)
  return data
}

export const useTemplates = () => useQuery('templates', getTemplates)

export const useTemplateById = (id) =>
  useQuery(['templates', id], () => getTemplateById(id))

export const useAddTemplate = () => {
  const queryClient = useQueryClient()

  return useMutation(addTemplate, {
    onSuccess: (newTemplate) =>
      queryClient.setQueryData('templates', (templates) => [
        ...templates,
        newTemplate,
      ]),
  })
}
