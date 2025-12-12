import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: true,
  toast: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    showToast: (state, action) => {
      state.toast = action.payload
    },
    hideToast: (state) => {
      state.toast = null
    },
  },
})

export const { toggleSidebar, setSidebarOpen, showToast, hideToast } = uiSlice.actions
export default uiSlice.reducer

