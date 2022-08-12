import { Auth } from 'aws-amplify'
import { SyntheticEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import useInput from 'src/hooks/useInput'
import { toUsername } from 'src/utils/toUsername'

function Confirmation() {
  const history = useHistory()
  const [loading, setLoading] = useState(false)

  const { value: email, bind: bindEmail } = useInput('')
  const { value: code, bind: bindCode } = useInput('')

  const handleSubmit = async (e: SyntheticEvent<Element, Event>) => {
    e.preventDefault()
    console.log('handling submit')
    setLoading(true)
    try {
      await Auth.confirmSignUp(toUsername(email), code)
      console.log('Verified successfully ')
      history.push('/signin')
    } catch (error: any) {
      console.warn(error.message || '')
    }
    setLoading(false)
  }

  return (
    <>
      <h1>Confirmation</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" {...bindEmail} />
        <input type="text" placeholder="Verification code" {...bindCode} />
        <button type="submit" disabled={loading}>
          Verify account
        </button>
        <Link to="/signin">Log In &rarr;</Link>
      </form>
    </>
  )
}

export default Confirmation
