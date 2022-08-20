import SignOutBtn from 'src/components/SignOutBtn'
import Bookings from 'src/features/bookings/Bookings'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'

function Dashboard() {
  return (
    <>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            textAlign: 'center',
          }}
        >
          <SignOutBtn />
        </Box>
        <Bookings />
      </CardContent>
    </>
  )
}

export default Dashboard
