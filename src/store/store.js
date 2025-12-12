import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import eventReducer from './eventSlice'
import bookingReducer from './bookingSlice'
import uiReducer from './uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    bookings: bookingReducer,
    ui: uiReducer,
  },
})

