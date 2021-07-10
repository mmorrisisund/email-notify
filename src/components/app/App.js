import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import HomePage from 'pages/home'

export function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={HomePage} />
      </Switch>
    </Router>
  )
}
