import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents } from '@/store/eventSlice'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Calendar, MapPin, Ticket, LogIn, UserPlus, LogOut } from 'lucide-react'
import Footer from '@/components/Footer'
import Carousel from '@/components/Carousel'

const Landing = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { events, loading } = useSelector((state) => state.events)
  const { user } = useSelector((state) => state.auth)

  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    dispatch(fetchEvents())
  }, [dispatch])

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !locationFilter || locationFilter === 'all' || event.location === locationFilter
    const matchesDate = !dateFilter || event.date.startsWith(dateFilter)
    return matchesSearch && matchesLocation && matchesDate
  })

  const uniqueLocations = [...new Set(events.map(e => e.location).filter(loc => loc && loc.trim() !== ''))]

  const handleEventClick = (eventId) => {
    if (user) {
      navigate(`/events/${eventId}`)
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <h1 className="text-xl sm:text-2xl font-bold text-indigo-600 cursor-pointer" onClick={() => navigate('/')}>
                Event Booking
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 sm:space-x-4"
            >
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex"
                    onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard')}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      localStorage.removeItem('token')
                      localStorage.removeItem('user')
                      window.location.reload()
                    }}
                  >
                    <span className="hidden sm:inline">Logout</span>
                    <LogOut className="h-4 w-4 sm:hidden" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="flex items-center space-x-2"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate('/register')}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </Button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white py-12 sm:py-16 lg:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 px-4"
          >
            Discover Amazing Events
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-indigo-100 px-4 max-w-2xl mx-auto"
          >
            Book your tickets for the best events happening around you
          </motion.p>
          {!user && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
            >
              
            </motion.div>
          )}
          {user && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 justify-center px-4"
            >
              <Button size="lg" onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard')} className="bg-white text-indigo-600 hover:bg-indigo-50 w-full sm:w-auto">
                Go to Dashboard
              </Button>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Search and Filters */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 -mt-6 sm:-mt-10">
        <Card className="shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="sm:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 sm:h-5 sm:w-5" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 sm:pl-10 h-10 sm:h-11"
                  />
                </div>
              </div>
              <Select value={locationFilter || 'all'} onValueChange={setLocationFilter}>
                <SelectTrigger className="h-10 sm:h-11">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.filter(loc => loc && loc.trim() !== '').map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="Filter by date"
                className="h-10 sm:h-11"
              />
            </div>
          </CardContent>
        </Card>
      </section>



      {/* Featured Events Carousel */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <Carousel 
            title="Featured Events"
            items={events.slice(0, 5).map(event => ({
                title: event.title,
                description: event.description,
                image: event.image,
                badge: 'Popular',
                action: (
                    <Button 
                        size="sm" 
                        variant="secondary"
                        className="w-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                        onClick={() => handleEventClick(event.id)}
                    >
                        View Details
                    </Button>
                )
            }))}
         />
      </section>

      {/* All Events Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => handleEventClick(event.id)}
              >
                <Card className="h-full hover:shadow-lg transition-shadow flex flex-col">
                  {event.image && (
                    <div className="h-40 sm:h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="flex-1">
                    <CardTitle className="text-lg sm:text-xl line-clamp-1">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-sm sm:text-base">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2">
                      {event.location && (
                        <div className="flex items-center text-slate-600">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-xs sm:text-sm truncate">{event.location}</span>
                        </div>
                      )}
                      <div className="flex items-center text-slate-600">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Ticket className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{event.availableSeats} seats available</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3 sm:gap-0">
                      <span className="text-xl sm:text-2xl font-bold text-indigo-600">${event.price}</span>
                      <Button size="sm" className="w-full sm:w-auto">View Details</Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

export default Landing

