import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import bookingsReducer from 'src/features/bookings/bookingsSlice'

export const store = configureStore({
  reducer: {
    bookings: bookingsReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
