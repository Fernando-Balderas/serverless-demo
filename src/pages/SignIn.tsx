import { Auth } from 'aws-amplify'
import { SyntheticEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import useAuth from 'src/hooks/useAuth'
import useInput from 'src/hooks/useInput'

function SignIn() {
  const localAuth = useAuth()
  const history = useHistory()
  const [loading, setLoading] = useState(false)

  const { value: email, bind: bindEmail } = useInput('')
  const { value: password, bind: bindPassword } = useInput('')

  const handleSubmit = async (e: SyntheticEvent<Element, Event>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await Auth.signIn(email, password)
      console.log('Login successfully', user)
      await localAuth.setUser(user)
      history.push('/')
    } catch (error: any) {
      console.warn(error.message || 'Error')
    }
    setLoading(false)
  }

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" {...bindEmail} />
        <input type="password" {...bindPassword} />
        <button type="submit" disabled={loading}>
          Login
        </button>
        <Link to="/signup">Create account &rarr;</Link>
      </form>
    </>
  )
}

export default SignIn
