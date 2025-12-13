import axios from 'axios'

const API_BASE_URL = 'https://gravitserver-production.up.railway.app/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Retry logic for network errors or specific status codes
    if (error.message === 'Network Error' || (error.response && error.response.status >= 500) || error.code === 'ERR_HTTP2_PING_FAILED') {
      originalRequest._retry = originalRequest._retry || 0;
      if (originalRequest._retry < 3) {
        originalRequest._retry += 1;
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, originalRequest._retry * 1000));
        return api(originalRequest);
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

