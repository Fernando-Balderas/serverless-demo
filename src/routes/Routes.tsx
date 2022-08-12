import { Switch, Route } from 'react-router-dom'
import PrivateRoute from '../helpers/PrivateRoute'

const SignUp = () => {
  return <h1>SignUp</h1>
}

const SignIn = () => {
  return <h1>SignIn</h1>
}

const Dashboard = () => {
  return <h1>Dashboard</h1>
}

const NotFound = () => {
  return <h1>NotFound</h1>
}

function Routes() {
  return (
    <Switch>
      <Route exact path="/signin" component={SignIn} />
      <Route exact path="/signup" component={SignUp} />
      <PrivateRoute exact path="/">
        <Dashboard />
      </PrivateRoute>
      <Route path="*" component={NotFound} />
    </Switch>
  )
}

export default Routes
