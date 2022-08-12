import { SyntheticEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import useInput from 'src/hooks/useInput'
import { toUsername } from 'src/utils/toUsername'

function SignUp() {
  const history = useHistory()
  const [loading, setLoading] = useState(false)

  const { value: name, bind: bindName } = useInput('')
  const { value: email, bind: bindEmail } = useInput('')
  const { value: phone, bind: bindPhone } = useInput('')
  const { value: company, bind: bindCompany } = useInput('')
  const { value: password, bind: bindPassword } = useInput('')
  const { value: confirmPassword, bind: bindConfirmPassword } = useInput('')

  const handleSubmit = async (e: SyntheticEvent<Element, Event>) => {
    e.preventDefault()
    setLoading(true)

    if (password !== confirmPassword) {
      console.warn("Passwords don't match")
      return
    }

    try {
      await Auth.signUp({
        username: toUsername(email),
        password,
        attributes: {
          email,
          name,
          phone_number: phone,
          'custom:company': company,
        },
      })
      console.log('Signup successfully')
      history.push('/confirmation')
    } catch (error: any) {
      console.warn(error.message || 'Error')
    }
    setLoading(false)
  }

  return (
    <>
      <h1>SignUp</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" {...bindName} />
        <input type="email" placeholder="Email" {...bindEmail} />
        <input type="text" placeholder="Phone" {...bindPhone} />
        <input type="text" placeholder="Company" {...bindCompany} />
        <input type="password" placeholder="Password" {...bindPassword} />
        <input
          type="password"
          placeholder="Confirm password"
          {...bindConfirmPassword}
        />
        <button type="submit" disabled={loading}>
          Sign Up
          {loading && 'Loading...'}
        </button>
        <Link to="/signin">Log In &rarr;</Link>
      </form>
    </>
  )
}

export default SignUp
