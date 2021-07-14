export function TemplatesPage() {
  return (
    <main className='py-8'>
      <div className='flex max-w-5xl mx-auto  '>
        <div className='flex-grow'>
          <div>
            <label className='block text-gray-700 font-medium'>
              Pick a Template
            </label>
            <select>
              <option>Template 1</option>
              <option>Template 2</option>
              <option>Template 3</option>
            </select>
          </div>
        </div>
        <div className='flex-grow max-w-3xl'>
          <form>
            <div className='space-y-12'>
              <div className='grid grid-cols-2'>
                <label className='font-medium text-gray-700'>
                  Template Name
                </label>
                <input
                  type='text'
                  className='rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
              <hr className='col-span-2' />
              <div className='grid grid-cols-2'>
                <label>From</label>
                <input type='text' className='rounded border-gray-300' />
              </div>
              <hr className='col-span-2' />
              <div className='grid grid-cols-2'>
                <label>To</label>
                <select className='rounded border-gray-300'>
                  <option>Shareholder Notification</option>
                  <option>Late Pricing</option>
                  <option>Price Error</option>
                </select>
              </div>
              <hr className='col-span-2' />
              <div className='grid grid-cols-2'>
                <label>Subject</label>
                <input type='text' className='rounded border-gray-300' />
              </div>
              <hr className='col-span-2' />
              <div className='grid grid-cols-2'>
                <label>Body</label>
                <textarea className='rounded border-gray-300'></textarea>
              </div>
              <hr className='col-span-2' />
            </div>
            <div className='space-x-4'>
              <button className='bg-blue-500 text-blue-50 rounded px-4 py-2 mt-12'>
                Save
              </button>
              <button className='text-blue-500 border-blue-500 border rounded px-4 py-2 mt-12'>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
