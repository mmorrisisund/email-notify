import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { useForm } from 'react-hook-form'

import { useEmailLists } from 'hooks/email'
import { useTemplates, useAddTemplate, useTemplateById } from 'hooks/template'

const modes = [
  { label: 'New', description: 'Create a new template' },
  { label: 'Edit', description: 'Edit an existing template' },
]

export function TemplatesPage() {
  const [mode, setMode] = useState('')
  const [templateId, setTemplateId] = useState()
  const { register, handleSubmit, reset } = useForm()
  const { data: lists, isLoading: listsIsLoading } = useEmailLists()
  const { data: templates, isLoading: templatesIsLoading } = useTemplates()
  const { data: template, isLoading: templateIsLoading } =
    useTemplateById(templateId)
  const addTemplateMutation = useAddTemplate()
  console.log(template)
  const handleOnSubmit = async (data) => {
    try {
      await addTemplateMutation.mutateAsync(data)
      reset()
    } catch (error) {
      console.error(error)
    }
  }

  const templateSelectionChanged = (e) => {
    setTemplateId(e.target.value)
  }

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
              <select
                className='w-full rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                onChange={templateSelectionChanged}
              >
                {!templatesIsLoading &&
                  templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.templateName}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        <div className='w-px mx-8 bg-gray-200' />

        <div className='flex-grow max-w-3xl'>
          {mode !== '' && (
            <form onSubmit={handleSubmit(handleOnSubmit)}>
              <div className='space-y-12'>
                <div className='grid grid-cols-form'>
                  <label className='ml-4 font-medium text-sm text-gray-700'>
                    Template Name
                  </label>
                  <input
                    type='text'
                    className='rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    {...register('templateName', { required: true })}
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
                    {...register('fromAddress', { required: true })}
                  />
                </div>
                <hr className='col-span-2' />
                <div className='grid grid-cols-form'>
                  <label className='ml-4 font-medium text-sm text-gray-700'>
                    To
                  </label>
                  <select
                    className='rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    {...register('emailList')}
                  >
                    {!listsIsLoading &&
                      lists.map((list) => (
                        <option key={list.id} value={list.name}>
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
                    {...register('subject', { required: true })}
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
                    {...register('body', { required: true })}
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
