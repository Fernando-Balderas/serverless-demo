import { useState } from 'react'
import BookingForm from 'src/components/BookingForm'
import useAuth from 'src/hooks/useAuth'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { removeBooking, selectBookings, setBookings } from './bookingsSlice'
import axiosi from 'src/helpers/axios/instance'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
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
    setLoading(true)
    try {
      const res = await axiosi.delete(`bookings/${bookingId}`, {
        headers: {
          Authorization: localAuth.accessToken,
        },
      })
      console.log('res ', res.data)
      dispatch(removeBooking(res.data.BookingId))
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
      <Typography component="h2" variant="h5">
        Bookings
      </Typography>
      <Stack spacing={1} direction="row">
        <Button
          type="button"
          variant="contained"
          disabled={loading}
          onClick={handleGetAll}
        >
          Get Bookings
        </Button>
        {!showForm && (
          <Button
            type="button"
            variant="contained"
            disabled={loading}
            onClick={() => setShowForm(true)}
          >
            New Booking
          </Button>
        )}
      </Stack>
      {showForm && <BookingForm booking={updateBooking} hideForm={hideForm} />}
      <List>
        {bookings.Count <= 0 && 'No bookings'}
        {bookings.Count > 0 &&
          bookings.Items.map((booking) => (
            <ListItem key={booking.BookingId}>
              <ListItemText primary={booking.GuestName} />
              <Stack spacing={1} direction="row">
                <IconButton
                  aria-label="edit"
                  disabled={loading}
                  onClick={() => handleUpdate(booking)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  disabled={loading}
                  onClick={() => handleDelete(booking.BookingId)}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </ListItem>
          ))}
      </List>
    </>
  )
}

export default Bookings
