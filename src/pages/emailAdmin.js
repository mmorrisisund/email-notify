import { Fragment, useState } from 'react'
import { Transition, Dialog } from '@headlessui/react'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import axios from 'axios'

const getId = () => Math.round(Math.random() * 10000)

export function EmailAdminPage() {
  const queryClient = useQueryClient()
  const [selectedList, setSelectedList] = useState(undefined)
  const [listAddIsOpen, setListAddIsOpen] = useState(false)
  const [listName, setListName] = useState('')
  const [emailAddIsOpen, setEmailAddIsOpen] = useState(false)
  const [emailEditIsOpen, setEmailEditIsOpen] = useState(false)
  const [email, setEmail] = useState('')
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
    addListMutation.mutate({ name, addresses: [] })
    setListName('')
    setListAddIsOpen(false)
  }
  const handleListAddCancel = () => {
    setListName('')
    setListAddIsOpen(false)
  }

  const handleEmailRemove = (id) => {
    const newEmailList = selectedList.addresses.filter(
      (email) => email.id !== id
    )
    const newList = { ...selectedList, addresses: newEmailList }
    updateListMutation.mutate(newList)
    // setLists(
    //   lists.map((list) => (list.id === selectedList.id ? newList : list))
    // )
    setSelectedList(newList)
  }

  const handleEmailAddSubmit = (e) => {
    e.preventDefault()
    const emails = e.target.email.value.split(',')

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

    setEmail('')
    setEmailAddIsOpen(false)
  }
  const handleEmailAddCancel = () => {
    setEmail('')
    setEmailAddIsOpen(false)
  }
  const handleEmailEditSubmit = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const emailIndex = selectedList.addresses.findIndex(
      ({ address }) => address === priorEmail
    )
    const newEmail = { ...selectedList.addresses[emailIndex], address: email }
    const newAddresses = [...selectedList.addresses]
    newAddresses.splice(emailIndex, 1, newEmail)
    const newList = { ...selectedList, addresses: newAddresses }
    updateListMutation.mutate(newList)

    setSelectedList(newList)
    setPriorEmail('')
    setEmail('')
    setEmailEditIsOpen(false)
  }
  const handleEmailEditCancel = () => {
    setEmail('')
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

      <div className='flex flex-col'>
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
                            setEmail(email.address)
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
      </div>

      <Transition show={listAddIsOpen} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-10 overflow-y-auto'
          onClose={handleListAddCancel}
        >
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0 bg-gray-900 bg-opacity-50' />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900'
                >
                  Add a new Distribution List
                </Dialog.Title>

                <label className='block my-6'>
                  <span className='text-gray-700'>List name</span>
                  <input
                    type='text'
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-indigo-blue-500 focus:ring-opacity-50'
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                  />
                </label>

                <div className='mt-4 flex justify-end'>
                  <button
                    type='button'
                    className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0  sm:w-auto sm:text-sm'
                    onClick={handleListAddCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md sm:ml-3 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                    onClick={() => handleListAddSubmit(listName)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <Transition show={emailAddIsOpen} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-10 overflow-y-auto'
          onClose={handleEmailAddCancel}
        >
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0 bg-gray-900 bg-opacity-50' />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900'
                >
                  Add a new email address
                </Dialog.Title>

                <form onSubmit={handleEmailAddSubmit}>
                  <label className='block my-6'>
                    <span className='text-gray-700'>Email address</span>
                    <input
                      name='email'
                      type='email'
                      multiple
                      required
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-indigo-blue-500 focus:ring-opacity-50'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>

                  <div className='mt-4 flex justify-end'>
                    <button
                      type='button'
                      className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0  sm:w-auto sm:text-sm'
                      onClick={handleEmailAddCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md sm:ml-3 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <Transition show={emailEditIsOpen} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 z-10 overflow-y-auto'
          onClose={handleEmailEditCancel}
        >
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0 bg-gray-900 bg-opacity-50' />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900'
                >
                  Edit email address
                </Dialog.Title>

                <form onSubmit={handleEmailEditSubmit}>
                  <label className='block my-6'>
                    <span className='text-gray-700'>Email address</span>
                    <input
                      name='email'
                      type='email'
                      required
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-indigo-blue-500 focus:ring-opacity-50'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>

                  <div className='mt-4 flex justify-end'>
                    <button
                      type='button'
                      className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0  sm:w-auto sm:text-sm'
                      onClick={handleEmailEditCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md sm:ml-3 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </main>
  )
}
