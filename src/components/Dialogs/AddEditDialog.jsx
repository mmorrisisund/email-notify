import { Fragment, useState, useEffect } from 'react'
import { Transition, Dialog } from '@headlessui/react'

function AddEditDialog({
  titleContent,
  label,
  onClose,
  onSubmit,
  isOpen,
  type,
  initialValue = '',
}) {
  const [text, setText] = useState('')

  useEffect(() => setText(initialValue), [initialValue])

  const handleClose = () => {
    initialValue ? setText(initialValue) : setText('')
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (initialValue) {
      onSubmit(initialValue, text)
    } else {
      onSubmit(text)
    }
    setText('')
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-10 overflow-y-auto'
        onClose={handleClose}
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
                {titleContent}
              </Dialog.Title>

              <form onSubmit={handleSubmit}>
                <label className='block my-6' htmlFor='input'>
                  <span className='text-gray-700'>{label}</span>
                  <input
                    name='input'
                    type={type}
                    multiple
                    required
                    className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-indigo-blue-500 focus:ring-opacity-50'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </label>

                <div className='mt-4 flex justify-end'>
                  <button
                    type='button'
                    className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0  sm:w-auto sm:text-sm'
                    onClick={handleClose}
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
  )
}

export default AddEditDialog
