import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { useEmailLists } from 'hooks/email'

const modes = [
  { label: 'New', description: 'Create a new template' },
  { label: 'Edit', description: 'Edit an existing template' },
]

export function TemplatesPage() {
  const [mode, setMode] = useState('')
  const { data: lists, isLoading } = useEmailLists()

  return (
    <main className='p-8'>
      <div className='flex max-w-7xl'>
        <div className='flex-grow max-w-xs'>
          <div>
            <RadioGroup value={mode} onChange={setMode}>
              <div className='mb-6'>
                <RadioGroup.Label className='font-medium text-sm text-gray-900'>
                  Mode
                </RadioGroup.Label>
              </div>
              <div className='space-y-4'>
                {modes.map((mode) => (
                  <RadioGroup.Option
                    key={mode.label}
                    value={mode.label}
                    className={({ active, checked }) =>
                      `${active ? 'ring ' : ''}
                      ${checked ? 'bg-blue-500  ' : ''}
                      rounded shadow px-5 py-4 cursor-pointer flex focus:outline-none transition`
                    }
                  >
                    {({ checked }) => (
                      <div className='flex items-center justify-between w-full'>
                        <div className='flex items-center'>
                          <div className='text-sm'>
                            <RadioGroup.Label
                              as='p'
                              className={`font-medium ${
                                checked ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              {mode.label}
                            </RadioGroup.Label>
                            <RadioGroup.Description
                              as='span'
                              className={`inline ${
                                checked ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {mode.description}
                            </RadioGroup.Description>
                          </div>
                        </div>
                      </div>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>

          <hr className='my-8 mx-4' />

          {mode === 'Edit' && (
            <div className=''>
              <label className='block mb-4 text-sm text-gray-700 font-medium'>
                Pick a Template
              </label>
              <select className='w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500'>
                <option>Template 1</option>
                <option>Template 2</option>
                <option>Template 3</option>
              </select>
            </div>
          )}
        </div>

        <div className='w-px mx-8 bg-gray-200' />

        <div className='flex-grow max-w-3xl'>
          {mode !== '' && (
            <form>
              <div className='space-y-12'>
                <div className='grid grid-cols-form'>
                  <label className='ml-4 font-medium text-sm text-gray-700'>
                    Template Name
                  </label>
                  <input
                    type='text'
                    className='rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <hr className='col-span-2' />
                <div className='grid grid-cols-form'>
                  <label className='ml-4 font-medium text-sm text-gray-700'>
                    From
                  </label>
                  <input
                    type='text'
                    className='rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <hr className='col-span-2' />
                <div className='grid grid-cols-form'>
                  <label className='ml-4 font-medium text-sm text-gray-700'>
                    To
                  </label>
                  <select className='rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500'>
                    {!isLoading &&
                      lists.map((list) => (
                        <option key={list.id} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                  </select>
                </div>
                <hr className='col-span-2' />
                <div className='grid grid-cols-form'>
                  <label className='ml-4 font-medium text-sm text-gray-700'>
                    Subject
                  </label>
                  <input
                    type='text'
                    className='rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <hr className='col-span-2' />
                <div className='grid grid-cols-form'>
                  <label className='ml-4 font-medium text-sm text-gray-700'>
                    Body
                  </label>
                  <textarea
                    className='rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    rows='5'
                  ></textarea>
                </div>
                <hr className='col-span-2' />
              </div>
              <div className='space-x-4'>
                <button
                  type='submit'
                  className='bg-blue-500 text-blue-50 rounded px-4 py-2 mt-12'
                >
                  Save
                </button>
                <button className='text-blue-500 border-blue-500 border rounded px-4 py-2 mt-12'>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
