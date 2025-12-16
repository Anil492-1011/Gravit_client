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

  // Filter events: Active status AND Future date
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !locationFilter || locationFilter === 'all' || event.location === locationFilter
    const matchesDate = !dateFilter || event.date.startsWith(dateFilter)
    
    // Status and Expiry Check
    const isActive = event.status === 'live' || event.status === 'upcoming'
    const isFuture = new Date(event.date) >= new Date()
    
    return matchesSearch && matchesLocation && matchesDate && isActive && isFuture
  })

  const uniqueLocations = [...new Set(events.filter(e => e.status === 'live' || e.status === 'upcoming').map(e => e.location).filter(loc => loc && loc.trim() !== ''))]

  const handleEventClick = (eventId) => {
    if (user) {
      navigate(`/events/${eventId}`)
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50 transition-all">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent cursor-pointer" onClick={() => navigate('/')}>
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
                    className="hidden sm:flex text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                    onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard')}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-red-600 hover:bg-red-50"
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
                    className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate('/register')}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow"
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
        className="bg-indigo-600 relative overflow-hidden text-white py-20 sm:py-24 lg:py-32"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight"
          >
            Discover Amazing Events
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl lg:text-2xl mb-8 text-indigo-100 max-w-2xl mx-auto font-light"
          >
            Your gateway to unforgettable experiences. Book tickets for concerts, workshops, and more.
          </motion.p>
          {user && (
             <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
             >
                <Button size="lg" onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard')} className="bg-white text-indigo-600 hover:bg-indigo-50 border-none shadow-lg hover:shadow-xl transition-all">
                    Go to Dashboard
                </Button>
             </motion.div>
          )}
        </div>
      </motion.section>

      {/* Search and Filters */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <Card className="shadow-xl border-none bg-white/95 backdrop-blur">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search events by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>
              <Select value={locationFilter || 'all'} onValueChange={setLocationFilter}>
                <SelectTrigger className="h-12 border-slate-200 font-medium">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-12 border-slate-200 font-medium"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Featured Events Carousel */}
      {events.filter(e => e.status === 'live').length > 0 && (
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
             <Carousel 
                title="Featured Events"
                items={events.filter(e => e.status === 'live').slice(0, 5).map(event => ({
                    title: event.title,
                    description: event.description,
                    image: event.image,
                    badge: 'Trending',
                    action: (
                        <Button 
                            size="sm" 
                            className="w-full bg-white/90 text-indigo-600 hover:bg-white border-none shadow-sm font-semibold"
                            onClick={() => handleEventClick(event.id)}
                        >
                            View Details
                        </Button>
                    )
                }))}
             />
          </section>
      )}

      {/* All Events Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50/50">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">All Events</h2>
            <div className="text-sm font-medium text-slate-500">{filteredEvents.length} events found</div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-slate-500 font-medium">Loading amazing events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="bg-slate-50 p-4 rounded-full inline-block mb-4">
                 <Calendar className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No events found</h3>
            <p className="text-slate-500 max-w-md mx-auto mt-2">
                We couldn't find any events matching your filters. Try adjusting your search or come back later!
            </p>
            <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => {
                    setSearchTerm('')
                    setLocationFilter('all')
                    setDateFilter('')
                }}
            >
                Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-white ring-1 ring-slate-200/50 hover:ring-indigo-100">
                  <div className="relative h-48 sm:h-52 overflow-hidden cursor-pointer" onClick={() => handleEventClick(event.id)}>
                    {event.image ? (
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                            <Calendar className="h-12 w-12 text-slate-300" />
                        </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                        {event.status === 'live' ? 'Live Now' : 'Upcoming'}
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => handleEventClick(event.id)}>
                            {event.title}
                        </CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2 text-sm text-slate-500 mt-1">
                        {event.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 space-y-3 pt-0">
                    <div className="flex items-center text-sm text-slate-600">
                        <Calendar className="h-4 w-4 mr-2.5 text-indigo-500 flex-shrink-0" />
                        <span className="font-medium">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="h-4 w-4 mr-2.5 text-indigo-500 flex-shrink-0" />
                      <span className="truncate">{event.location || 'Online Event'}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Ticket className="h-4 w-4 mr-2.5 text-indigo-500 flex-shrink-0" />
                      <span>{event.availableSeats} / {event.totalSeats} seats left</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-3 border-t border-slate-50 bg-slate-50/50">
                    <div className="flex items-center justify-between w-full">
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-semibold">Price</span>
                            <div className="text-xl font-bold text-slate-900">₹{event.price}</div>
                        </div>
                        <Button onClick={() => handleEventClick(event.id)} className="bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all">
                            Book Now
                        </Button>
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

