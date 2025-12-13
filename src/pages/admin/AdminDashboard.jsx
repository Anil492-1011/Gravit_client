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
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {user?.name || 'Admin'}!</p>
        </div>
        <Button onClick={() => navigate('/admin/events/create')} className="bg-indigo-600 hover:bg-indigo-700">
          Create New Event
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <Card className="border-none shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-slate-800">Recent Bookings</CardTitle>
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" onClick={() => navigate('/admin/bookings')}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentBookings.map((booking) => (
                        <TableRow key={booking.id || booking._id} className="hover:bg-slate-50/50">
                          <TableCell className="font-medium">{booking.event?.title || 'Unknown Event'}</TableCell>
                          <TableCell>{booking.user?.name || 'Guest'}</TableCell>
                          <TableCell className="text-slate-500">{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right font-medium text-indigo-600">${booking.totalAmount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <Ticket className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No bookings yet</p>
                  <p className="text-slate-400 text-sm mt-1">Wait for users to book events</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div variants={itemVariants} className="xl:col-span-1">
          <Card className="border-none shadow-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-slate-800">Upcoming Events</CardTitle>
              <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" onClick={() => navigate('/admin/events')}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="group flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer" onClick={() => navigate(`/admin/events`)}> {/* Ideally navigate to edit page */}
                      <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm">
                        {new Date(event.date).getDate()}
                        <span className="text-[10px] uppercase block -mt-1">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                          {event.title}
                        </p>
                        <div className="flex items-center text-xs text-slate-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center text-xs text-slate-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors self-center" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No upcoming events</p>
                  <Button variant="link" onClick={() => navigate('/admin/events/create')} className="text-indigo-600 p-0 h-auto mt-2">
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
