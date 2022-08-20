import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SignOutBtn from 'src/components/SignOutBtn'
import Bookings from 'src/features/bookings/Bookings'

function Dashboard() {
  return (
    <>
      <SignOutBtn />
      <h1>Dashboard</h1>
      <Bookings />
      <Card sx={{ minWidth: 275, width: '500px' }}>
        <CardHeader
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          // title="Shrimp and Chorizo Paella"
          subheader="User"
        />
        <CardContent>
          <Typography variant="h5" component="div">
            benevolent
          </Typography>
          <Typography variant="body2">
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}

export default Dashboard
