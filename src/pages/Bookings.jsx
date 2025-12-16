import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserBookings } from '@/store/bookingSlice'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import  QRCode  from 'qrcode.react'
import { Calendar, MapPin, Ticket, Download, Search, QrCode } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const Bookings = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { bookings, loading } = useSelector((state) => state.bookings)
  const { user } = useSelector((state) => state.auth)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (user) {
      dispatch(fetchUserBookings(user.id))
    }
  }, [dispatch, user])

  const handleViewQR = (booking) => {
    setSelectedBooking(booking)
    setQrDialogOpen(true)
  }

  const handleDownloadQR = () => {
    if (!selectedBooking) return
    const svg = document.querySelector('#qr-code svg')
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        const url = canvas.toDataURL()
        const link = document.createElement('a')
        link.download = `ticket-${selectedBooking.id}.png`
        link.href = url
        link.click()
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }
  }

  const filteredBookings = bookings.filter(booking => 
    booking.event?.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-slate-500 mt-1">View your event bookings and tickets</p>
        </div>
        <Button onClick={() => navigate('/events')} size="lg" className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
          Browse Events
        </Button>
      </div>

      {/* Search and Filters (Optional but nice) */}
      {bookings.length > 0 && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input 
                placeholder="Search bookings..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
      )}

      {loading ? (
        <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
             <p className="text-slate-500">Loading your tickets...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        bookings.length === 0 ? (
            // Absolute Empty State
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-2xl border border-dashed border-slate-200 text-center shadow-sm"
            >
                <div className="bg-indigo-50 p-6 rounded-full mb-6">
                    <Ticket className="h-12 w-12 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No bookings yet</h3>
                <p className="text-slate-500 max-w-sm mb-8">
                    You haven't booked any events yet. Explore our events and book your first ticket today!
                </p>
                <Button onClick={() => navigate('/events')} size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                    Browse Events
                </Button>
            </motion.div>
        ) : (
            // Search Empty State
             <div className="text-center py-12">
                 <p className="text-slate-500">No bookings found matching "{searchTerm}"</p>
             </div>
        )
      ) : (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredBookings.map((booking) => (
            <motion.div key={booking.id} variants={itemVariants} className="h-full">
              <Card className="h-full flex flex-col border shadow-sm hover:shadow-md transition-all group overflow-hidden">
                <CardHeader className="p-0 relative">
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 z-10">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm backdrop-blur-md
                            ${booking.status === 'confirmed' ? 'bg-green-100/90 text-green-700' : 
                              booking.status === 'cancelled' ? 'bg-red-100/90 text-red-700' :
                              'bg-yellow-100/90 text-yellow-700'}
                        `}>
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                        </span>
                    </div>

                    {/* Image */}
                    <div className="h-48 w-full bg-slate-100 relative">
                        {booking.event?.image || booking.img ? (
                            <img 
                                src={booking.event?.image || booking.img} 
                                alt={booking.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                                <Calendar className="h-12 w-12 text-indigo-200" />
                            </div>
                        )}
                        {/* Overlay Gradient */}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                             <Button 
                                size="sm" 
                                variant="secondary" 
                                className="bg-white/90 hover:bg-white text-indigo-600 font-semibold"
                                onClick={() => navigate(`/events/${booking.event?.id || booking.eventId}`)}
                             >
                                 View Event Details
                             </Button>
                         </div>
                    </div>
                </CardHeader>
                
                <CardContent className="flex-1 p-5 space-y-4">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1 line-clamp-1">{booking.title || booking.event?.title || 'Unknown Event'}</h3>
                        <p className="text-xs text-slate-500 font-mono">ID: {booking.id?.slice(-8).toUpperCase()}</p>
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex items-start text-sm text-slate-600">
                             <Calendar className="h-4 w-4 mr-2.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                             <span>{new Date(booking.date || booking.event?.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} • {new Date(booking.date || booking.event?.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-start text-sm text-slate-600">
                             <MapPin className="h-4 w-4 mr-2.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                             <span className="line-clamp-1">{booking.location || booking.event?.location || 'Online'}</span>
                        </div>
                         <div className="flex items-start text-sm text-slate-600">
                             <Ticket className="h-4 w-4 mr-2.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                             <span>{booking.seats?.length || 1} Ticket{booking.seats?.length !== 1 ? 's' : ''} <span className="text-slate-400">({booking.seats?.join(', ') || 'GA'})</span></span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-5 pt-0 mt-auto flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
                    <div className="py-4">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Amount</p>
                        <p className="text-xl font-bold text-slate-900">₹{booking.totalAmount}</p>
                    </div>
                    <Button 
                        onClick={() => handleViewQR(booking)}
                        className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all"
                    >
                        <QrCode className="h-4 w-4 mr-2" />
                        Show QR
                    </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Event Ticket</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6 py-4">
              <div id="qr-code" className="flex justify-center p-6 bg-white rounded-xl border-2 border-dashed border-indigo-100 relative">
                 {/* Decorative corners */}
                 <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-500 rounded-tl-lg -mt-1 -ml-1"></div>
                 <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-indigo-500 rounded-tr-lg -mt-1 -mr-1"></div>
                 <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-500 rounded-bl-lg -mb-1 -ml-1"></div>
                 <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-500 rounded-br-lg -mb-1 -mr-1"></div>
                 
                <QRCode
                  value={JSON.stringify({
                    bookingId: selectedBooking.id,
                    eventId: selectedBooking.eventId || selectedBooking.event?.id,
                    seats: selectedBooking.seats,
                  })}
                  size={220}
                  level={"H"}
                  includeMargin={true}
                />
              </div>
              
              <div className="text-center space-y-1">
                <h3 className="font-bold text-lg text-slate-900">{selectedBooking.title || selectedBooking.event?.title}</h3>
                <p className="text-sm text-slate-500">{new Date(selectedBooking.date || selectedBooking.event?.date).toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg">
                <div>
                   <p className="text-slate-500 text-xs uppercase tracking-wider">Booking ID</p>
                   <p className="font-mono font-medium">{selectedBooking.id?.slice(-8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                   <p className="text-slate-500 text-xs uppercase tracking-wider">Seats</p>
                   <p className="font-medium">{selectedBooking.seats?.join(', ')}</p>
                </div>
              </div>

              <Button onClick={handleDownloadQR} className="w-full bg-indigo-600 hover:bg-indigo-700">
                <Download className="h-4 w-4 mr-2" />
                Download Ticket
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Bookings
