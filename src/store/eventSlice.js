import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

const initialState = {
  events: [],
  currentEvent: null,
  loading: false,
  error: null,
}

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/events')
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events')
    }
  }
)

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/events/${id}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch event')
    }
  }
)

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await api.post('/events', eventData)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create event')
    }
  }
)

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/events/${id}`, eventData)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update event')
    }
  }
)

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/events/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete event')
    }
  }
)

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearCurrentEvent: (state) => {
      state.currentEvent = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
        state.error = null
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Event By ID
      .addCase(fetchEventById.pending, (state, action) => {
        // Only set loading to true if we're fetching a different event
        // or if there's no current event. This prevents flickering during polling.
        if (!state.currentEvent || state.currentEvent.id !== parseInt(action.meta.arg)) {
          state.loading = true
        }
        state.error = null
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false
        state.currentEvent = action.payload
        state.error = null
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create Event
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload)
      })
      // Update Event
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(e => e.id === action.payload.id)
        if (index !== -1) {
          state.events[index] = action.payload
        }
        if (state.currentEvent?.id === action.payload.id) {
          state.currentEvent = action.payload
        }
      })
      // Delete Event
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(e => e.id !== action.payload)
        if (state.currentEvent?.id === action.payload) {
          state.currentEvent = null
        }
      })
  },
})

export const { clearCurrentEvent, clearError } = eventSlice.actions
export default eventSlice.reducer

