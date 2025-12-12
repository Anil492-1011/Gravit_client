import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import AppLayout from '@/layouts/AppLayout'
import AdminLayout from '@/layouts/AdminLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import Events from '@/pages/Events'
import EventDetail from '@/pages/EventDetail'
import Bookings from '@/pages/Bookings'
import Profile from '@/pages/Profile'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminEvents from '@/pages/admin/AdminEvents'
import CreateEvent from '@/pages/admin/CreateEvent'
import AdminBookings from '@/pages/admin/AdminBookings'

const router = createBrowserRouter(
  [
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/landing', element: <Landing /> },
    { path: '/', element: <Landing /> },
    {
      path: '/dashboard',
      element: <AppLayout />,
      children: [
        { index: true, element: <ProtectedRoute element={<Dashboard />} /> },
      ],
    },
    {
      path: '/events',
      element: <AppLayout />,
      children: [
        { index: true, element: <ProtectedRoute element={<Events />} /> },
        { path: ':id', element: <ProtectedRoute element={<EventDetail />} /> },
      ],
    },
    {
      path: '/bookings',
      element: <AppLayout />,
      children: [
        { index: true, element: <ProtectedRoute element={<Bookings />} /> },
      ],
    },
    {
      path: '/profile',
      element: <AppLayout />,
      children: [
        { index: true, element: <ProtectedRoute element={<Profile />} /> },
      ],
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        { path: '/admin/dashboard', element: <ProtectedRoute element={<AdminDashboard />} adminOnly /> },
        { path: '/admin/events', element: <ProtectedRoute element={<AdminEvents />} adminOnly /> },
        { path: '/admin/events/create', element: <ProtectedRoute element={<CreateEvent />} adminOnly /> },
        { path: '/admin/bookings', element: <ProtectedRoute element={<AdminBookings />} adminOnly /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
)

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App

