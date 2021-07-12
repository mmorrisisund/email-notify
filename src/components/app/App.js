import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import { HomePage, TemplatesPage, EmailAdminPage } from 'pages'
import { Layout } from 'components/Layout'

const queryClient = new QueryClient()

export function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route exact path='/templates' component={TemplatesPage} />
            <Route exact path='/email-admin' component={EmailAdminPage} />
          </Switch>
        </Layout>
      </QueryClientProvider>
    </Router>
  )
}
