import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
}

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bookings', bookingData)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking')
    }
  }
)

export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUserBookings',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookings/user/${userId}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings')
    }
  }
)

export const fetchAllBookings = createAsyncThunk(
  'bookings/fetchAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings')
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings')
    }
  }
)

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookings/${id}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch booking')
    }
  }
)

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/bookings/${id}`, { status })
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update booking')
    }
  }
)

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false
        state.currentBooking = action.payload
        state.bookings.unshift(action.payload)
        state.error = null
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch User Bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload
        state.error = null
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch All Bookings
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload
        state.error = null
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Booking By ID
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.currentBooking = action.payload
      })
      // Update Booking
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b.id === action.payload.id)
        if (index !== -1) {
          state.bookings[index] = action.payload
        }
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload
        }
      })
  },
})

export const { clearCurrentBooking, clearError } = bookingSlice.actions
export default bookingSlice.reducer

