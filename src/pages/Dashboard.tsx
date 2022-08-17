import SignOutBtn from 'src/components/SignOutBtn'
import Bookings from 'src/features/bookings/Bookings'

function Dashboard() {
  return (
    <>
      <SignOutBtn />
      <h1>Dashboard</h1>
      <Bookings />
    </>
  )
}

export default Dashboard
