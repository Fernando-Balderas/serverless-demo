import { Link } from 'react-router-dom'

function SignIn() {
  return (
    <>
      <h1>Log In</h1>
      <Link to="/signup">Create account &rarr;</Link>
    </>
  )
}

export default SignIn
