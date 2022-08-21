import { Auth } from 'aws-amplify'
import { SyntheticEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import useInput from 'src/hooks/useInput'
import { toUsername } from 'src/utils/toUsername'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

function Confirmation() {
  const history = useHistory()
  const [loading, setLoading] = useState(false)

  const { value: email, bind: bindEmail } = useInput('')
  const { value: code, bind: bindCode } = useInput('')

  const handleSubmit = async (e: SyntheticEvent<Element, Event>) => {
    e.preventDefault()
    setLoading(true)
    try {
      await Auth.confirmSignUp(toUsername(email), code)
      history.push('/signin')
    } catch (error: any) {
      console.warn(error.message || 'Confirmation Error')
    }
    setLoading(false)
  }

  return (
    <>
      <Box
        component="form"
        sx={{
          marginTop: 8,
          marginBottom: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onSubmit={handleSubmit}
      >
        <Typography component="h1" variant="h5">
          Confirmation
        </Typography>
        <TextField
          type="email"
          label="Email"
          margin="dense"
          autoFocus
          {...bindEmail}
        />
        <TextField
          type="text"
          label="Confirmation Code"
          margin="dense"
          {...bindCode}
        />
        <Button
          type="submit"
          disabled={loading}
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Verify account
        </Button>
        <Link to="/signin">Sign In &rarr;</Link>
      </Box>
    </>
  )
}

export default Confirmation
