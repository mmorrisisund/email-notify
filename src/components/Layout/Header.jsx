import { NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className='h-24 flex items-center justify-between p-8 shadow'>
      <div>
        <h1 className='text-blue-400 text-4xl'>Principal</h1>
      </div>
      <nav className='space-x-6 flex'>
        <NavLink
          exact
          to='/'
          className='transition text-xl text-blue-400 hover:border-b-4 hover:border-blue-400'
          activeClassName='pb-1 border-b-4 border-blue-400'
        >
          Home
        </NavLink>
        <NavLink
          exact
          to='/templates'
          className='transition text-xl text-blue-400 hover:border-b-4 hover:border-blue-400'
          activeClassName='pb-1 border-b-4 border-blue-400'
        >
          Templates
        </NavLink>
        <NavLink
          exact
          to='/email-admin'
          className='transition text-xl text-blue-400 hover:border-b-4 hover:border-blue-400'
          activeClassName='pb-1 border-b-4 border-blue-400'
        >
          Email Admin
        </NavLink>
      </nav>
    </header>
  )
}

export default Header
