import { useState } from 'react'
import useInput from 'src/hooks/useInput'
import axiosi from 'src/helpers/axios/instance'
import useAuth from 'src/hooks/useAuth'
import { useAppDispatch } from 'src/app/hooks'
import {
  pushBooking,
  setUpdatedBooking,
} from 'src/features/bookings/bookingsSlice'
import { ISOToLocal } from 'src/utils/dateTime'
import Box from '@mui/material/Box'
import { SubmitFn, TBooking } from 'src/types'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'

type BookingFormProps = {
  booking: TBooking | null
  hideForm: () => void
}

function BookingForm({ booking, hideForm }: BookingFormProps) {
  const dispatch = useAppDispatch()
  const localAuth = useAuth()
  const [loading, setLoading] = useState(false)

  const { value: guestName, bind: bindGuestName } = useInput(
    booking?.GuestName || ''
  )
  const { value: guests, bind: bindGuests } = useInput(booking?.Guests || 1)
  const { value: rooms, bind: bindRooms } = useInput(booking?.Rooms || 1)
  const { value: checkIn, bind: bindCheckIn } = useInput(
    ISOToLocal(booking?.CheckIn || new Date().toISOString())
  )
  const { value: checkOut, bind: bindCheckOut } = useInput(
    ISOToLocal(booking?.CheckOut || new Date().toISOString())
  )

  const handleCreate: SubmitFn = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const createRes = await axiosi.post(
        '/bookings',
        {
          GuestName: guestName,
          CheckIn: new Date(checkIn).toISOString(),
          CheckOut: new Date(checkOut).toISOString(),
          Guests: guests,
          Rooms: rooms,
        },
        {
          headers: {
            Authorization: localAuth.accessToken,
          },
        }
      )
      const { BookingId } = createRes.data
      const fetchRes = await axiosi.get(`/bookings/${BookingId}`, {
        headers: {
          Authorization: localAuth.accessToken,
        },
      })
      dispatch(pushBooking(fetchRes.data.Item))
    } catch (error: any) {
      console.warn(error.message || 'Error')
    }
    hideForm()
    setLoading(false)
  }

  const handleUpdate: SubmitFn = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updatedBooking: Partial<TBooking> = {
        BookingId: booking?.BookingId,
        GuestName: guestName,
        CheckIn: new Date(checkIn).toISOString(),
        CheckOut: new Date(checkOut).toISOString(),
        Guests: guests,
        Rooms: rooms,
      }
      await axiosi.put('/bookings', updatedBooking, {
        headers: {
          Authorization: localAuth.accessToken,
        },
      })
      dispatch(setUpdatedBooking(updatedBooking))
    } catch (error: any) {
      console.warn(error.message || 'Error')
    }
    hideForm()
    setLoading(false)
  }

  const handleSubmit = booking === null ? handleCreate : handleUpdate

  return (
    <Box
      component="form"
      sx={{
        marginTop: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexWrap: 'wrap',
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      onSubmit={handleSubmit}
    >
      <TextField
        type="text"
        label="Guest Name"
        margin="dense"
        style={{ width: '82.3%' }}
        autoFocus
        {...bindGuestName}
      />
      <div>
        <TextField
          type="number"
          label="Guests"
          margin="dense"
          {...bindGuests}
        />
        <TextField type="number" label="Rooms" margin="dense" {...bindRooms} />
      </div>
      <div>
        <TextField
          type="datetime-local"
          label="Check In"
          margin="dense"
          {...bindCheckIn}
        />
        <TextField
          type="datetime-local"
          label="Check Out"
          margin="dense"
          {...bindCheckOut}
        />
      </div>
      <Stack spacing={1} direction="row">
        <Button
          type="button"
          variant="outlined"
          color="info"
          disabled={loading}
          onClick={() => hideForm()}
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          Submit
        </Button>
      </Stack>
    </Box>
  )
}

export default BookingForm
