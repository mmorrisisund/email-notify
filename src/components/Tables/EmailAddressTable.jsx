import { useState } from 'react'

import AddEditDialog from 'components/Dialogs/AddEditDialog'
import { useEmailList, useUpdateEmailList } from 'hooks/email'

const getId = () => Math.round(Math.random() * 10000)

function EmailAddressTable({ listId }) {
  const [addIsOpen, setAddIsOpen] = useState(false)
  const [editIsOpen, setEditIsOpen] = useState(false)
  const [priorEmail, setPriorEmail] = useState('')
  const { data: list } = useEmailList(listId)
  const updateMutation = useUpdateEmailList()

  const handleAddSubmit = (value) => {
    const emails = value.split(',')
    const uniqueEmails = [...new Set(emails)]

    if (uniqueEmails.length > 0) {
      const newAddresses = uniqueEmails.map((email) => ({
        id: getId(),
        address: email,
      }))
      const newList = {
        ...list,
        addresses: [...list.addresses, ...newAddresses],
      }
      updateMutation.mutate(newList)
    }

    setAddIsOpen(false)
  }
  const handleAddClose = () => {
    setAddIsOpen(false)
  }
  const handleEditClose = () => {
    setEditIsOpen(false)
  }
  const handleEmailRemove = (id) => {
    const newEmailList = list.addresses.filter((email) => email.id !== id)
    const newList = { ...list, addresses: newEmailList }
    updateMutation.mutate(newList)
  }
  const handleEditSubmit = (prevValue, newValue) => {
    const email = newValue
    const emailIndex = list.addresses.findIndex(
      ({ address }) => address === prevValue
    )
    const newEmail = { ...list.addresses[emailIndex], address: email }
    const newAddresses = [...list.addresses]
    newAddresses.splice(emailIndex, 1, newEmail)
    const newList = { ...list, addresses: newAddresses }
    updateMutation.mutate(newList)

    setEditIsOpen(false)
  }

  return (
    <>
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
                        onClick={() => setAddIsOpen(true)}
                      >
                        Add
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {list?.addresses.map((email) => (
                    <tr key={email.id}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {email.address}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <button
                          className='text-indigo-600 hover:text-indigo-900'
                          onClick={() => {
                            setPriorEmail(email.address)
                            setEditIsOpen(true)
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

      <AddEditDialog
        isOpen={addIsOpen}
        titleContent='Add a new email address'
        label='Email address'
        onClose={handleAddClose}
        onSubmit={handleAddSubmit}
      />

      <AddEditDialog
        isOpen={editIsOpen}
        titleContent='Edit email address'
        label='Email address'
        onClose={handleEditClose}
        onSubmit={handleEditSubmit}
        initialValue={priorEmail}
      />
    </>
  )
}

export default EmailAddressTable
