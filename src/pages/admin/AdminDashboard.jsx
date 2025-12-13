import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents } from '@/store/eventSlice'
import { fetchAllBookings } from '@/store/bookingSlice'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Ticket, DollarSign, Users, ChevronRight, MapPin, Clock } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { events, loading: eventsLoading } = useSelector((state) => state.events)
  const { bookings, loading: bookingsLoading } = useSelector((state) => state.bookings)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchEvents())
    dispatch(fetchAllBookings())
  }, [dispatch])

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
  const liveEvents = events.filter(e => e.status === 'live').length
  const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5)
  const recentBookings = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  const stats = [
    {
      title: 'Total Events',
      value: events.length,
      icon: Calendar,
      color: 'text-indigo-600',
      bg: 'bg-indigo-100',
    },
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: Ticket,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Live Events',
      value: liveEvents,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto p-2 sm:p-4" // Added padding wrapper if not already in layout
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Welcome back, {user?.name || 'Admin'}!</p>
        </div>
        <Button onClick={() => navigate('/admin/events/create')} className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
          <ChevronRight className="h-4 w-4 mr-1 hidden sm:inline" />
          Create Event
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants} className="h-full">
            <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Bookings */}
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <Card className="border shadow-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">Recent Bookings</CardTitle>
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium text-xs uppercase tracking-wide" onClick={() => navigate('/admin/bookings')}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              {bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-b border-slate-100 hover:bg-transparent">
                        <TableHead className="w-[40%] font-semibold text-slate-500 uppercase text-xs tracking-wider">Event</TableHead>
                        <TableHead className="font-semibold text-slate-500 uppercase text-xs tracking-wider">User</TableHead>
                        <TableHead className="font-semibold text-slate-500 uppercase text-xs tracking-wider">Date</TableHead>
                        <TableHead className="text-right font-semibold text-slate-500 uppercase text-xs tracking-wider">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentBookings.map((booking) => (
                        <TableRow key={booking.id || booking._id} className="hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors">
                          <TableCell className="font-medium text-slate-900">{booking.event?.title || 'Unknown Event'}</TableCell>
                          <TableCell className="text-slate-600">{booking.user?.name || 'Guest'}</TableCell>
                          <TableCell className="text-slate-500 text-sm">{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right font-medium text-indigo-600">${booking.totalAmount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-16 flex flex-col items-center justify-center h-full">
                  <div className="bg-slate-50 p-4 rounded-full mb-3">
                    <Ticket className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">No bookings yet</p>
                  <p className="text-slate-400 text-sm mt-1">New bookings will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div variants={itemVariants} className="xl:col-span-1">
          <Card className="border shadow-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">Upcoming Events</CardTitle>
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium text-xs uppercase tracking-wide" onClick={() => navigate('/admin/events')}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              {upcomingEvents.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="group p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-4" onClick={() => navigate(`/admin/events`)}>
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 rounded-lg flex flex-col items-center justify-center border border-indigo-100">
                        <span className="text-indigo-600 font-bold text-lg leading-none">{new Date(event.date).getDate()}</span>
                        <span className="text-[10px] uppercase text-indigo-400 font-medium mt-0.5">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {event.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center text-xs text-slate-500">
                                <Clock className="h-3 w-3 mr-1 text-slate-400" />
                                {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex items-center text-xs text-slate-500">
                                <MapPin className="h-3 w-3 mr-1 text-slate-400" />
                                <span className="truncate max-w-[100px]">{event.location}</span>
                            </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                 <div className="text-center py-16 flex flex-col items-center justify-center h-full">
                  <div className="bg-slate-50 p-4 rounded-full mb-3">
                    <Calendar className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">No upcoming events</p>
                  <Button variant="link" onClick={() => navigate('/admin/events/create')} className="text-indigo-600 p-0 h-auto mt-2 font-medium">
                    Create your first event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

    </motion.div>
  )
}

export default AdminDashboard
