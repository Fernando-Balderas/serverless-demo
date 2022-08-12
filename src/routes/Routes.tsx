import { Switch, Route, useLocation } from 'react-router-dom'
import PrivateRoute from '../helpers/PrivateRoute'
import SignUp from 'src/pages/SignUp'
import SignIn from 'src/pages/SignIn'
import Dashboard from 'src/pages/Dashboard'
import Confirmation from 'src/pages/Confirmation'
import NotFound from 'src/pages/NotFound'

function Routes() {
  let location = useLocation()
  return (
    <Switch location={location}>
      <Route exact path="/signin" component={SignIn} />
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/confirmation" component={Confirmation} />
      <PrivateRoute exact path="/">
        <Dashboard />
      </PrivateRoute>
      <Route path="*" component={NotFound} />
    </Switch>
  )
}

export default Routes
