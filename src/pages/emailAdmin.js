import { useState } from 'react'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import axios from 'axios'

import AddEditDialog from 'components/Dialogs/AddEditDialog'
import EmailAddressTable from 'components/Tables/EmailAddressTable'

const getId = () => Math.round(Math.random() * 10000)

export function EmailAdminPage() {
  const queryClient = useQueryClient()
  const [selectedList, setSelectedList] = useState(undefined)
  const [listAddIsOpen, setListAddIsOpen] = useState(false)
  const [emailAddIsOpen, setEmailAddIsOpen] = useState(false)
  const [emailEditIsOpen, setEmailEditIsOpen] = useState(false)
  const [priorEmail, setPriorEmail] = useState('')

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
  const updateListMutation = useMutation(
    async (list) => {
      const { data } = await axios.put(`lists/${list.id}`, list)
      return data
    },
    {
      onSuccess: (data, vars) => {
        queryClient.setQueryData(['lists'], (oldData) =>
          oldData.map((list) => (list.id === vars.id ? vars : list))
        )
      },
    }
  )

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

  const handleEmailRemove = (id) => {
    const newEmailList = selectedList.addresses.filter(
      (email) => email.id !== id
    )
    const newList = { ...selectedList, addresses: newEmailList }
    updateListMutation.mutate(newList)
    setSelectedList(newList)
  }

  const handleEmailAddSubmit = (value) => {
    const emails = value.split(',')

    const uniqueEmails = emails.filter(
      (email) =>
        selectedList.addresses.findIndex(({ address }) => address === email) ===
        -1
    )

    if (uniqueEmails.length > 0) {
      const newAddresses = uniqueEmails.map((email) => ({
        id: getId(),
        address: email,
      }))
      const newList = {
        ...selectedList,
        addresses: [...selectedList.addresses, ...newAddresses],
      }
      updateListMutation.mutate(newList)
      setSelectedList(newList)
    }

    setEmailAddIsOpen(false)
  }
  const handleEmailAddCancel = () => {
    setEmailAddIsOpen(false)
  }

  const handleEmailEditSubmit = (prevValue, newValue) => {
    const email = newValue
    const emailIndex = selectedList.addresses.findIndex(
      ({ address }) => address === prevValue
    )
    const newEmail = { ...selectedList.addresses[emailIndex], address: email }
    const newAddresses = [...selectedList.addresses]
    newAddresses.splice(emailIndex, 1, newEmail)
    const newList = { ...selectedList, addresses: newAddresses }
    updateListMutation.mutate(newList)

    setSelectedList(newList)
    setEmailEditIsOpen(false)
  }
  const handleEmailEditCancel = () => {
    setEmailEditIsOpen(false)
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

      <EmailAddressTable listId={selectedList.id} />

      {/* <div className='flex flex-col'>
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
                      Email Address
                    </th>
                    <th scope='col' className='relative px-6 py-3'>
                      <span className='sr-only'>Edit</span>
                    </th>
                    <th scope='col' className='relative px-6 py-3'>
                      <span className='sr-only'>Remove</span>
                      <button
                        className='px-3 py-1 bg-blue-500 text-blue-50 rounded disabled:bg-opacity-50'
                        onClick={() => setEmailAddIsOpen(true)}
                        disabled={!selectedList}
                      >
                        Add
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {selectedList?.addresses.map((email) => (
                    <tr key={email.id}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {email.address}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <button
                          className='text-indigo-600 hover:text-indigo-900'
                          onClick={() => {
                            setPriorEmail(email.address)
                            setEmailEditIsOpen(true)
                          }}
                        >
                          Edit
                        </button>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
                        <button
                          className='text-red-600 hover:text-red-900'
                          onClick={() => handleEmailRemove(email.id)}
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
      </div> */}

      <AddEditDialog
        isOpen={listAddIsOpen}
        titleContent='Add a new Distribution List'
        label='List name'
        onClose={() => setListAddIsOpen(false)}
        onSubmit={handleListAddSubmit}
      />

      <AddEditDialog
        isOpen={emailAddIsOpen}
        titleContent='Add a new email address'
        label='Email address'
        onClose={handleEmailAddCancel}
        onSubmit={handleEmailAddSubmit}
      />

      <AddEditDialog
        isOpen={emailEditIsOpen}
        titleContent='Edit email address'
        label='Email address'
        onClose={handleEmailEditCancel}
        onSubmit={handleEmailEditSubmit}
        initialValue={priorEmail}
      />
    </main>
  )
}
