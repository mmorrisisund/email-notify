import { useState } from 'react'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import axios from 'axios'

import AddEditDialog from 'components/Dialogs/AddEditDialog'
import EmailAddressTable from 'components/Tables/EmailAddressTable'

export function EmailAdminPage() {
  const queryClient = useQueryClient()
  const [selectedList, setSelectedList] = useState(undefined)
  const [listAddIsOpen, setListAddIsOpen] = useState(false)
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
  }
  const handleListRemove = (id) => {
    if (selectedList?.id === id) {
      setSelectedList(undefined)
    }
    removeListMutation.mutate(id)
  }

  const handleListAddSubmit = (name) => {
    setListAddIsOpen(false)
    addListMutation.mutate({ name, addresses: [] })
  }

  return (
    <main className='grid grid-cols-2 max-w-8xl mx-8 space-x-16 py-8'>
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
                        onClick={() => setListAddIsOpen(true)}
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
                            onClick={() => handleListRemove(list.id)}
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

      {selectedList && <EmailAddressTable listId={selectedList?.id} />}

      <AddEditDialog
        isOpen={listAddIsOpen}
        titleContent='Add a new Distribution List'
        label='List name'
        onClose={() => setListAddIsOpen(false)}
        onSubmit={handleListAddSubmit}
      />
    </main>
  )
}
