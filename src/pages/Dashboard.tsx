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

  const handleGetAll = async () => {
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

  const handleCreate = async () => {
    setLoading(true)
    try {
      const res = await axiosi.post(
        '/bookings',
        {
          GuestName: 'username',
          Guests: 4,
          Rooms: 2,
        },
        {
          headers: {
            Authorization: localAuth.accessToken,
          },
        }
      )
      console.log('response ', res.data)
    } catch (error: any) {
      console.warn(error.message || 'Error')
    }
    setLoading(false)
  }

  const handleUpdate = async (booking: Booking) => {
    setLoading(true)
    try {
      booking.GuestName = booking.GuestName + 'Updated'
      const res = await axiosi.put('/bookings', booking, {
        headers: {
          Authorization: localAuth.accessToken,
        },
      })
      console.log('response ', res.data)
    } catch (error: any) {
      console.warn(error.message || 'Error')
    }
    setLoading(false)
  }

  const handleDelete = async (bookingId: string) => {
    console.log('into handleDelete ', bookingId)
    setLoading(true)
    try {
      const res = await axiosi.delete(`bookings/${bookingId}`, {
        headers: {
          Authorization: localAuth.accessToken,
        },
      })
      console.log('res ', res.data)
    } catch (error: any) {
      console.warn(error.message || 'Error')
    }
    setLoading(false)
  }

  return (
    <>
      <SignOutBtn />
      <h1>Dashboard</h1>
      <button type="button" disabled={loading} onClick={handleGetAll}>
        Get Bookings
      </button>
      <button type="button" disabled={loading} onClick={handleCreate}>
        New Booking
      </button>
      <ul>
        {bookings.Count <= 0 && 'No bookings'}
        {bookings.Count > 0 &&
          bookings.Items.map((booking) => (
            <li key={booking.BookingId}>
              {booking.GuestName}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleUpdate(booking)}
              >
                Edit
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleDelete(booking.BookingId)}
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
    </>
  )
}

export default Dashboard
