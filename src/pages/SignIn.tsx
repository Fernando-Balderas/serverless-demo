import { SyntheticEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import useAuth from 'src/hooks/useAuth'
import useInput from 'src/hooks/useInput'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

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
      const token = user.signInUserSession.idToken.jwtToken || ''
      console.log('Login successfully ')
      await localAuth.setUser(user)
      await localAuth.login(token)
      history.push('/')
    } catch (error: any) {
      console.warn(error?.message || 'Error')
    }
    setLoading(false)
  }

  return (
    <>
      <Box
        component="form"
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onSubmit={handleSubmit}
      >
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <TextField
          type="email"
          label="Email"
          margin="dense"
          autoFocus
          {...bindEmail}
        />
        <TextField
          type="password"
          label="Password"
          margin="dense"
          {...bindPassword}
        />
        <Button
          type="submit"
          disabled={loading}
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>
        <Link to="/signup">Create account &rarr;</Link>
      </Box>
    </>
  )
}

export default SignIn
