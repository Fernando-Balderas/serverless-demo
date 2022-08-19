import useInput from 'src/hooks/useInput'
import axiosi from 'src/helpers/axios/instance'
import { SubmitFn, TBooking } from 'src/types'
import useAuth from 'src/hooks/useAuth'
import { useAppDispatch } from 'src/app/hooks'
import { setUpdatedBooking } from 'src/features/bookings/bookingsSlice'
import { ISOToLocal } from 'src/utils/dateTime'

type BookingFormProps = {
  booking: TBooking | null
  hideForm: () => void
}

function BookingForm({ booking, hideForm }: BookingFormProps) {
  const dispatch = useAppDispatch()
  const localAuth = useAuth()

  const {
    value: guestName,
    setValue: setGuestName,
    bind: bindGuestName,
  } = useInput(booking?.GuestName || '')
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
    try {
      const res = await axiosi.post(
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
      console.log('response ', res.data)
    } catch (error: any) {
      console.warn(error.message || 'Error')
    }
    hideForm()
  }

  const handleUpdate: SubmitFn = async (e) => {
    e.preventDefault()
    try {
      setGuestName(guestName + 'Updated')
      const updatedBooking: Partial<TBooking> = {
        BookingId: booking?.BookingId,
        GuestName: guestName,
        CheckIn: new Date(checkIn).toISOString(),
        CheckOut: new Date(checkOut).toISOString(),
        Guests: guests,
        Rooms: rooms,
      }
      const res = await axiosi.put('/bookings', updatedBooking, {
        headers: {
          Authorization: localAuth.accessToken,
        },
      })
      dispatch(setUpdatedBooking(updatedBooking))
      console.log('response ', res.data)
    } catch (error: any) {
      console.warn(error.message || 'Error')
    }
    hideForm()
  }

  const handleSubmit = booking === null ? handleCreate : handleUpdate

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="guestName">Guest Name:</label>
      <input
        type="text"
        id="guestName"
        placeholder="Guest Name"
        {...bindGuestName}
      />
      <label htmlFor="guests">Guests:</label>
      <input type="number" id="guests" placeholder="Guests" {...bindGuests} />
      <label htmlFor="rooms">Rooms:</label>
      <input type="number" id="rooms" placeholder="Rooms" {...bindRooms} />
      <label htmlFor="checkIn">Check In:</label>
      <input type="datetime-local" id="checkIn" {...bindCheckIn} />
      <label htmlFor="checkOut">Check Out:</label>
      <input type="datetime-local" id="checkOut" {...bindCheckOut} />
      <button type="button" onClick={() => hideForm()}>
        Cancel
      </button>
      <button type="submit">Submit</button>
    </form>
  )
}

export default BookingForm
