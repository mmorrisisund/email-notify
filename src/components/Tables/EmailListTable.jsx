import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

import AddEditDialog from 'components/Dialogs/AddEditDialog'

function EmailListTable({ onListChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedList, setSelectedList] = useState(undefined)
  const queryClient = useQueryClient()
  const {
    data: lists,
    isLoading,
    isError,
  } = useQuery('lists', async () => {
    const { data } = await axios.get('/lists')
    return data
  })

  const addListMutation = useMutation(
    async (newList) => await axios.post('/lists', newList),
    {
      onSuccess: ({ data }) => {
        queryClient.setQueryData(['lists'], (oldData) => [...oldData, data])
      },
    }
  )
  const removeListMutation = useMutation((id) => axios.delete(`/lists/${id}`), {
    onSuccess: (data, vars) => {
      queryClient.setQueryData(['lists'], (oldData) =>
        oldData.filter((list) => list.id !== vars)
      )
    },
  })

  const handleListSelect = (id) => {
    setSelectedList(lists.find((list) => list.id === id))
    onListChange(id)
  }
  const handleRemove = (id) => {
    if (selectedList?.id === id) {
      setSelectedList(undefined)
      onListChange(undefined)
    }
    removeListMutation.mutate(id)
  }

  const handleSubmit = (name) => {
    setIsOpen(false)
    addListMutation.mutate({ name, addresses: [] })
  }

  return (
    <>
      <div className='flex flex-col max-w-lg'>
        <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
            <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                    >
                      List Name
                    </th>
                    <th scope='col' className='relative px-6 py-3'>
                      <span className='sr-only'>Remove</span>
                      <button
                        className='px-3 py-1 bg-blue-500 text-blue-50 rounded'
                        onClick={() => setIsOpen(true)}
                      >
                        Add
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {!isLoading &&
                    !isError &&
                    lists.map((list) => (
                      <tr
                        key={list.id}
                        className={`${
                          list.id === selectedList?.id ? 'bg-blue-100' : ''
                        }`}
                      >
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          <button
                            className='w-full text-left'
                            onClick={() => handleListSelect(list.id)}
                          >
                            {list.name}
                          </button>
                        </td>

                        <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                          <button
                            className='text-red-600 hover:text-red-900'
                            onClick={() => handleRemove(list.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <AddEditDialog
        isOpen={isOpen}
        titleContent='Add a new Distribution List'
        label='List name'
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  )
}

export default EmailListTable
