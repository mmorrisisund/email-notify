import Header from './Header'
import Footer from './Footer'

export function Layout({ children }) {
  return (
    <div className='grid grid-rows-layout h-screen'>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
