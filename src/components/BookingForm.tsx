import useInput from 'src/hooks/useInput'
import axiosi from 'src/helpers/axios/instance'
import { SubmitFn, TBooking } from 'src/types'
import useAuth from 'src/hooks/useAuth'
import { useAppDispatch } from 'src/app/hooks'
import { setUpdatedBooking } from 'src/features/bookings/bookingsSlice'

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

  const handleCreate: SubmitFn = async (e) => {
    e.preventDefault()
    try {
      const res = await axiosi.post(
        '/bookings',
        {
          GuestName: guestName,
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
      <button type="button" onClick={() => hideForm()}>
        Cancel
      </button>
      <button type="submit">Submit</button>
    </form>
  )
}

export default BookingForm
