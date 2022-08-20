import { SyntheticEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import useInput from 'src/hooks/useInput'
import { toUsername } from 'src/utils/toUsername'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

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
          Sign Up
        </Typography>
        <TextField type="text" label="Name" margin="dense" {...bindName} />
        <TextField type="email" label="Email" margin="dense" {...bindEmail} />
        <TextField type="text" label="Phone" margin="dense" {...bindPhone} />
        <TextField
          type="text"
          label="Company"
          margin="dense"
          {...bindCompany}
        />
        <TextField
          type="password"
          label="Password"
          margin="dense"
          {...bindPassword}
        />
        <TextField
          type="password"
          label="Confirm password"
          margin="dense"
          {...bindConfirmPassword}
        />
        <Button
          type="submit"
          disabled={loading}
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
          {loading && 'Loading...'}
        </Button>
        <Link to="/signin">Log in &rarr;</Link>
      </Box>
    </>
  )
}

export default SignUp
