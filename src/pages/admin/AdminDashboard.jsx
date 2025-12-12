import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents } from '@/store/eventSlice'
import { fetchAllBookings } from '@/store/bookingSlice'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Ticket, DollarSign, Users } from 'lucide-react'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { events } = useSelector((state) => state.events)
  const { bookings } = useSelector((state) => state.bookings)

  useEffect(() => {
    dispatch(fetchEvents())
    dispatch(fetchAllBookings())
  }, [dispatch])

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
  const liveEvents = events.filter(e => e.status === 'live').length
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length
  const totalBookings = bookings.length

  const stats = [
    {
      title: 'Total Events',
      value: events.length,
      icon: Calendar,
      color: 'text-indigo-600',
    },
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: Ticket,
      color: 'text-green-600',
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-blue-600',
    },
    {
      title: 'Live Events',
      value: liveEvents,
      icon: Users,
      color: 'text-purple-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">Overview of your event booking system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/admin/events/create')}>
              Create New Event
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/events')}>
              Manage Events
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/bookings')}>
              View All Bookings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard

