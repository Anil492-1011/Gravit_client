import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents } from '@/store/eventSlice'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Calendar, MapPin, Ticket } from 'lucide-react'

const Events = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { events, loading } = useSelector((state) => state.events)

  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    dispatch(fetchEvents())
  }, [dispatch])

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !locationFilter || locationFilter === 'all' || event.location === locationFilter
    const matchesStatus = !statusFilter || statusFilter === 'all' || event.status === statusFilter
    return matchesSearch && matchesLocation && matchesStatus
  })

  const uniqueLocations = [...new Set(events.map(e => e.location).filter(loc => loc && loc.trim() !== ''))]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">All Events</h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">Discover and book tickets for upcoming events</p>
      </div>

      {/* Filters */}
      <Card>
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
            <Select value={statusFilter || 'all'} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 sm:h-11">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
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
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => navigate(`/events/${event.id}`)}
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
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg sm:text-xl line-clamp-1 flex-1">{event.title}</CardTitle>
                    <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                      event.status === 'live' ? 'bg-green-100 text-green-700' :
                      event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>
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
    </div>
  )
}

export default Events

