import { SyntheticEvent } from 'react'

export type TBookings = {
  Count: number
  Items: TBooking[]
}

export type TBooking = {
  BookingId: string
  CheckIn: string
  CheckOut: string
  GuestName: string
  Guests: number
  Rooms: number
}

export type SubmitFn = (e: SyntheticEvent<Element, Event>) => void
