import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents } from '@/store/eventSlice'
import { fetchUserBookings } from '@/store/bookingSlice'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Ticket, DollarSign, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { events } = useSelector((state) => state.events)
  const { bookings } = useSelector((state) => state.bookings)

  useEffect(() => {
    dispatch(fetchEvents())
    if (user) {
      dispatch(fetchUserBookings(user.id))
    }
  }, [dispatch, user])

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).slice(0, 3)
  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: Ticket,
      color: 'text-indigo-600',
    },
    {
      title: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      title: 'Total Spent',
      value: `$${totalSpent.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-blue-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name}!</h1>
        <p className="text-slate-600 mt-2">Here's what's happening with your bookings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Upcoming Events */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Upcoming Events</h2>
          <Button onClick={() => navigate('/events')}>View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.length === 0 ? (
            <p className="text-slate-600 col-span-3">No upcoming events</p>
          ) : (
            upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="cursor-pointer" onClick={() => navigate(`/events/${event.id}`)}>
                  {event.image && (
                    <div className="h-32 overflow-hidden rounded-t-lg">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription>{event.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Recent Bookings</h2>
          <Button onClick={() => navigate('/bookings')}>View All</Button>
        </div>
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-slate-600">No bookings yet</p>
              <Button className="mt-4" onClick={() => navigate('/events')}>
                Browse Events
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{booking.title || 'Event'}</h3>
                        <p className="text-sm text-slate-600">
                          Seats: {booking.seats?.join(', ') || 'N/A'} • ${booking.totalAmount}
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => navigate(`/bookings`)}>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

