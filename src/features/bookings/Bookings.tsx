import { useState } from 'react'
import BookingForm from 'src/components/BookingForm'
import useAuth from 'src/hooks/useAuth'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { selectBookings, setBookings } from './bookingsSlice'
import axiosi from 'src/helpers/axios/instance'
import { TBooking } from 'src/types'

function Bookings() {
  const localAuth = useAuth()
  const dispatch = useAppDispatch()
  const bookings = useAppSelector(selectBookings)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [updateBooking, setUpdateBooking] = useState<TBooking | null>(null)

  const handleGetAll = async () => {
    setLoading(true)
    try {
      const res = await axiosi.get('/bookings', {
        headers: {
          Authorization: localAuth.accessToken,
        },
      })
      dispatch(setBookings(res.data))
      console.log('response ', res.data)
    } catch (error: any) {
      console.warn(error.message || 'Error')
    }
    setLoading(false)
  }

  const handleUpdate = (booking: TBooking) => {
    setUpdateBooking(booking)
    setShowForm(true)
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

  const hideForm = () => {
    setShowForm(false)
    setUpdateBooking(null)
  }

  return (
    <>
      <h2>Bookings</h2>
      <button type="button" disabled={loading} onClick={handleGetAll}>
        Get Bookings
      </button>
      {!showForm && (
        <button
          type="button"
          disabled={loading}
          onClick={() => setShowForm(true)}
        >
          New Booking
        </button>
      )}
      {showForm && <BookingForm booking={updateBooking} hideForm={hideForm} />}
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

export default Bookings
