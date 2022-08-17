import useInput from 'src/hooks/useInput'
import axiosi from 'src/helpers/axios/instance'
import { SubmitFn, TBooking } from 'src/types'
import useAuth from 'src/hooks/useAuth'

type BookingFormProps = {
  Booking?: TBooking
}

function BookingForm({ Booking }: BookingFormProps) {
  const localAuth = useAuth()
  const {
    value: guestName,
    setValue: setGuestName,
    bind: bindGuestName,
  } = useInput(Booking?.GuestName || '')
  const { value: guests, bind: bindGuests } = useInput(Booking?.Guests || 1)
  const { value: rooms, bind: bindRooms } = useInput(Booking?.Rooms || 1)

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
  }

  const handleUpdate: SubmitFn = async (e) => {
    e.preventDefault()
    try {
      setGuestName(guestName + 'Updated')
      const res = await axiosi.put(
        '/bookings',
        {
          BookingId: Booking?.BookingId,
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
  }

  const handleSubmit =
    typeof Booking === 'undefined' ? handleCreate : handleUpdate

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
      <button type="submit">Submit</button>
    </form>
  )
}

export default BookingForm
