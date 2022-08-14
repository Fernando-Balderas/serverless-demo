import { useState } from 'react'
import SignOutBtn from 'src/components/SignOutBtn'
import axiosi from 'src/helpers/axios/instance'
import useAuth from 'src/hooks/useAuth'

type Bookings = {
  Count: number
  Items: Booking[]
}

type Booking = {
  BookingId: string
  CheckIn: string
  CheckOut: string
  GuestName: string
  Guests: number
  Rooms: number
}

function Dashboard() {
  const localAuth = useAuth()
  const [loading, setLoading] = useState(false)
  const [bookings, setBookings] = useState<Bookings>({ Count: 0, Items: [] })

  const handleClick = async () => {
    console.log('handling click')
    setLoading(true)
    try {
      const res = await axiosi.get('/bookings', {
        headers: {
          Authorization: localAuth.accessToken,
        },
      })
      setBookings(res.data)
      console.log('response ', res.data)
    } catch (error: any) {
      console.warn(error.message || 'Error')
    }
    setLoading(false)
  }

  return (
    <>
      <SignOutBtn />
      <h1>Dashboard</h1>
      <button type="button" disabled={loading} onClick={handleClick}>
        Get Bookings
      </button>
      {/* <button type="button">New Booking</button> */}
      <ul>
        {bookings.Count > 0 &&
          bookings.Items.map((booking) => (
            <li key={booking.BookingId}>
              {booking.GuestName}
              {/* <button type="button">Edit</button> */}
              {/* <button type="button">Delete</button> */}
            </li>
          ))}
      </ul>
    </>
  )
}

export default Dashboard
