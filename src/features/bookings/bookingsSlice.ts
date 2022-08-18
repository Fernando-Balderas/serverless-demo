import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TBooking, TBookings } from 'src/types'
import axiosi from 'src/helpers/axios/instance'
import { RootState } from 'src/app/store'

export interface BookingsState {
  bookings: TBookings
  status: 'idle' | 'loading' | 'failed'
}

const initialState: BookingsState = {
  bookings: { Count: 0, Items: [] },
  status: 'idle',
}

export const fetchAll = createAsyncThunk('bookings/fetchAll', async () => {
  const res = await axiosi.get('/bookings')
  // The value we return becomes the `fulfilled` action payload
  return res.data
})

export const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<TBookings>) => {
      state.bookings = action.payload
    },
    setUpdatedBooking: (state, action: PayloadAction<Partial<TBooking>>) => {
      const index = state.bookings.Items.findIndex(
        (booking) => booking.BookingId === action.payload.BookingId
      )
      if (index === -1) return
      state.bookings.Items[index] = {
        ...state.bookings.Items[index],
        ...action.payload,
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.status = 'idle'
        state.bookings = action.payload
      })
      .addCase(fetchAll.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export const { setBookings, setUpdatedBooking } = bookingsSlice.actions

export const selectBookings = (state: RootState) => state.bookings.bookings

export default bookingsSlice.reducer
