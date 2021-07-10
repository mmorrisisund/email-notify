import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { HomePage, TemplatesPage, EmailAdminPage } from 'pages'
import { Layout } from 'components/Layout'

export function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/templates' component={TemplatesPage} />
          <Route exact path='/email-admin' component={EmailAdminPage} />
        </Switch>
      </Layout>
    </Router>
  )
}
