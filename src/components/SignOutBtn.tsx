import Button from '@mui/material/Button'
import { Auth } from 'aws-amplify'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import useAuth from 'src/hooks/useAuth'

function SignOutBtn() {
  const localAuth = useAuth()
  const history = useHistory()
  const [loading, setLoading] = useState(false)

  if (!localAuth.authed) return null

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await Auth.signOut()
      await localAuth.logout()
      history.push('/')
    } catch (error: any) {
      console.warn(error.message || '')
    }
    setLoading(false)
  }

  return (
    <Button type="button" disabled={loading} onClick={handleSignOut}>
      Sign Out
    </Button>
  )
}

export default SignOutBtn
