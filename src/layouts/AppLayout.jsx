import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/store/authSlice'
import { toggleSidebar } from '@/store/uiSlice'
import { Sidebar, SidebarHeader, SidebarContent, SidebarItem, SidebarFooter, SidebarProvider } from '@/components/ui/sidebar'
import { Home, Calendar, Ticket, User, LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

const AppLayout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)
console.log("hey user ko print kr wa", user);
  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Events', path: '/events' },
    { icon: <Ticket className="h-5 w-5" />, label: 'My Bookings', path: '/bookings' },
    { icon: <User className="h-5 w-5" />, label: 'Profile', path: '/profile' },
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-slate-50">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
            </div>
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
              <div className="px-3 py-2 text-sm text-slate-600 truncate">
                {user?.name}
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
             {/* Mobile Header */}
             <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
                <div className="flex items-center gap-2">
                </div>
                <Button variant="ghost" size="icon" onClick={() => dispatch(toggleSidebar())}>
                    <Menu className="h-6 w-6 text-slate-600" />
                </Button>
            </div>

            <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-7xl mx-auto"
            >
                <Outlet />
            </motion.div>
            </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default AppLayout
