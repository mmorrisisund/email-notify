import { useState } from 'react'

import EmailAddressTable from 'components/Tables/EmailAddressTable'
import EmailListTable from 'components/Tables/EmailListTable'

export function EmailAdminPage() {
  const [selectedList, setSelectedList] = useState(undefined)

  return (
    <main className='grid grid-cols-2 max-w-8xl mx-8 space-x-16 py-8'>
      <EmailListTable onListChange={setSelectedList} />
      <EmailAddressTable listId={selectedList} />
    </main>
  )
}
