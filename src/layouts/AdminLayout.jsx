import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/store/authSlice'
import { Sidebar, SidebarHeader, SidebarContent, SidebarItem, SidebarFooter, SidebarProvider } from '@/components/ui/sidebar'
import { LayoutDashboard, Calendar, Ticket, LogOut, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const AdminLayout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const menuItems = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Events', path: '/admin/events' },
    { icon: <Plus className="h-5 w-5" />, label: 'Create Event', path: '/admin/events/create' },
    { icon: <Ticket className="h-5 w-5" />, label: 'Bookings', path: '/admin/bookings' },
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader>
            <span className="text-lg font-bold">Admin Panel</span>
          </SidebarHeader>
          <SidebarContent>
            {menuItems.map((item) => (
              <SidebarItem
                key={item.path}
                icon={item.icon}
                active={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </SidebarItem>
            ))}
          </SidebarContent>
          <SidebarFooter>
            <div className="space-y-2">
              <div className="px-3 py-2 text-sm text-slate-600">
                {user?.name}
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default AdminLayout

