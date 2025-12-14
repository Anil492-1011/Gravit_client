import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEventById } from '@/store/eventSlice'
import { fetchAllBookings } from '@/store/bookingSlice'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, MapPin, Ticket, Clock } from 'lucide-react'
import {
  joinEventRoom,
  lockSeat,
  unlockSeat,
  onSeatLocked,
  onSeatUnlocked,
  onSeatLockFailed,
  onLockedSeats,
  connectSocket,
  disconnectSocket,
} from '@/services/socket'
import { createBooking } from '@/store/bookingSlice'
import QRCode from 'qrcode.react'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

const EventDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentEvent, loading } = useSelector((state) => state.events)
  const { user } = useSelector((state) => state.auth)
  const { loading: bookingLoading } = useSelector((state) => state.bookings)
  const { toast } = useToast()

  const [selectedSeats, setSelectedSeats] = useState([])
  const [lockedSeats, setLockedSeats] = useState({})
  const [bookedSeats, setBookedSeats] = useState(new Set())
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: '',
  })
  const [bookingSuccess, setBookingSuccess] = useState(null)
  const [seatPollInterval, setSeatPollInterval] = useState(null)

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id))
      // Fetch bookings for this event to get booked seats
      dispatch(fetchAllBookings({ eventId: id })).then((result) => {
        if (result.type === 'bookings/fetchAllBookings/fulfilled') {
          const eventBookings = result.payload.filter(b => b.eventId === parseInt(id))
          const booked = new Set()
          eventBookings.forEach(booking => {
            if (booking.seats && Array.isArray(booking.seats)) {
              booking.seats.forEach(seat => booked.add(seat))
            }
          })
          setBookedSeats(booked)
        }
      })
    }
  }, [id, dispatch])

  useEffect(() => {
    if (currentEvent && user) {
      const socket = connectSocket()
      joinEventRoom(currentEvent.id)

      const handleSeatLocked = ({ seatIndex, userId }) => {
        if (userId !== user.id) {
          setLockedSeats((prev) => ({ ...prev, [seatIndex]: userId }))
        }
      }

      const handleSeatUnlocked = ({ seatIndex }) => {
        setLockedSeats((prev) => {
          const newState = { ...prev }
          delete newState[seatIndex]
          return newState
        })
      }

      const handleSeatLockFailed = ({ seatIndex, reason }) => {
        toast({
          title: 'Seat Lock Failed',
          description: reason,
          variant: 'destructive',
        })
        setSelectedSeats((prev) => prev.filter(s => s !== seatIndex))
      }

      const handleLockedSeats = (locks) => {
        setLockedSeats(locks)
      }

      onSeatLocked(handleSeatLocked)
      onSeatUnlocked(handleSeatUnlocked)
      onSeatLockFailed(handleSeatLockFailed)
      onLockedSeats(handleLockedSeats)

      // Poll for seat availability every 2 seconds
      const interval = setInterval(() => {
        if (currentEvent) {
          dispatch(fetchEventById(id))
          // Also refresh booked seats
          console.log('EventDetail interval dispatching with:', id)
          dispatch(fetchAllBookings({ eventId: id })).then((result) => {
            if (result.type === 'bookings/fetchAllBookings/fulfilled') {
              const eventBookings = result.payload.filter(b => b.eventId === currentEvent.id)
              const booked = new Set()
              eventBookings.forEach(booking => {
                if (booking.seats && Array.isArray(booking.seats)) {
                  booking.seats.forEach(seat => booked.add(seat))
                }
              })
              setBookedSeats(booked)
            }
          })
        }
      }, 2000)
      setSeatPollInterval(interval)

      return () => {
        disconnectSocket()
        if (interval) clearInterval(interval)
      }
    }
  }, [currentEvent, user, id, dispatch])

  const handleSeatClick = (seatIndex) => {
    if (!currentEvent || !user) {
      navigate('/login')
      return
    }

    if (selectedSeats.includes(seatIndex)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatIndex))
      unlockSeat(currentEvent.id, seatIndex, user.id)
    } else {
      setSelectedSeats([...selectedSeats, seatIndex])
      lockSeat(currentEvent.id, seatIndex, user.id)
    }
  }

  const getSeatStatus = (seatIndex) => {
    if (bookedSeats.has(seatIndex)) return 'booked'
    if (selectedSeats.includes(seatIndex)) return 'selected'
    if (lockedSeats[seatIndex]) {
      return lockedSeats[seatIndex] === user?.id ? 'locked-by-me' : 'locked'
    }
    return 'available'
  }

  const handleBookNow = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: 'No Seats Selected',
        description: 'Please select at least one seat',
        variant: 'destructive',
      })
      return
    }
    setBookingDialogOpen(true)
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    if (!currentEvent) return

    const bookingData = {
      eventId: currentEvent.id,
      seats: selectedSeats,
      quantity: selectedSeats.length,
      totalAmount: selectedSeats.length * currentEvent.price,
      ...bookingForm,
    }

    const result = await dispatch(createBooking(bookingData))
    if (result.type === 'bookings/createBooking/fulfilled') {
      setBookingSuccess(result.payload)
      setBookingDialogOpen(false)
      toast({
        title: 'Booking Successful!',
        description: 'Your tickets have been booked',
      })
    } else {
      toast({
        title: 'Booking Failed',
        description: result.payload || 'Failed to create booking',
        variant: 'destructive',
      })
    }
  }

  const renderSeatGrid = () => {
    if (!currentEvent) return null

    const seatsPerRow = 10
    const rows = Math.ceil(currentEvent.totalSeats / seatsPerRow)

    return (
      <div className="space-y-4">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 border-2 border-green-500 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-100 border-2 border-indigo-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
            <span>Locked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-100 border-2 border-red-500 rounded"></div>
            <span>Booked</span>
          </div>
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${seatsPerRow}, minmax(0, 1fr))` }}>
          {Array.from({ length: currentEvent.totalSeats }, (_, i) => {
            const seatNumber = i + 1
            const status = getSeatStatus(seatNumber)
            return (
              <motion.button
                key={seatNumber}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSeatClick(seatNumber)}
                disabled={status === 'locked' || status === 'booked'}
                className={`
                  w-10 h-10 rounded border-2 text-xs font-medium transition-colors
                  ${status === 'selected' ? 'bg-indigo-500 border-indigo-600 text-white' :
                    status === 'locked-by-me' ? 'bg-indigo-100 border-indigo-300 text-indigo-700' :
                    status === 'locked' ? 'bg-yellow-100 border-yellow-300 text-yellow-700 cursor-not-allowed' :
                    status === 'booked' ? 'bg-red-100 border-red-300 text-red-700 cursor-not-allowed' :
                    'bg-green-100 border-green-300 text-green-700 hover:bg-green-200'}
                `}
              >
                {seatNumber}
              </motion.button>
            )
          })}
        </div>
      </div>
    )
  }

  if (loading && !currentEvent) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-24" /> {/* Back button skeleton */}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full rounded-lg" /> {/* Image skeleton */}
            
            <Card>
              <CardHeader>
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-60" />
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!currentEvent) {
    return <div className="text-center py-12">Event not found</div>
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-6">
          {currentEvent.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-96 rounded-lg overflow-hidden"
            >
              <img src={currentEvent.image} alt={currentEvent.title} className="w-full h-full object-cover" />
            </motion.div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{currentEvent.title}</CardTitle>
              <CardDescription>{currentEvent.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentEvent.location && (
                <div className="flex items-center text-slate-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{currentEvent.location}</span>
                </div>
              )}
              <div className="flex items-center text-slate-600">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{new Date(currentEvent.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-slate-600">
                <Ticket className="h-5 w-5 mr-2" />
                <span>{currentEvent.availableSeats} seats available out of {currentEvent.totalSeats}</span>
              </div>
              <div className="flex items-center text-slate-600">
                <span className="text-2xl font-bold text-indigo-600">${currentEvent.price}</span>
                <span className="ml-2 text-slate-500">per ticket</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Your Seats</CardTitle>
              <CardDescription>Click on available seats to select them</CardDescription>
            </CardHeader>
            <CardContent>
              {renderSeatGrid()}
              {selectedSeats.length > 0 && (
                <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                  <p className="font-medium text-indigo-900">
                    Selected Seats: {selectedSeats.join(', ')}
                  </p>
                  <p className="text-indigo-700">
                    Total: ${(selectedSeats.length * currentEvent.price).toFixed(2)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Tickets:</span>
                <span className="font-medium">{selectedSeats.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per ticket:</span>
                <span className="font-medium">${currentEvent.price}</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-indigo-600">${(selectedSeats.length * currentEvent.price).toFixed(2)}</span>
              </div>
              <Button
                className="w-full"
                onClick={handleBookNow}
                disabled={selectedSeats.length === 0 || bookingLoading}
              >
                {bookingLoading ? 'Processing...' : 'Book Now'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              Please provide your contact information to complete the booking
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={bookingForm.name}
                onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={bookingForm.email}
                onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                value={bookingForm.mobile}
                onChange={(e) => setBookingForm({ ...bookingForm, mobile: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setBookingDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={bookingLoading}>
                {bookingLoading ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Booking Success Dialog */}
      <Dialog open={!!bookingSuccess} onOpenChange={() => setBookingSuccess(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Successful!</DialogTitle>
            <DialogDescription>
              Your tickets have been booked successfully
            </DialogDescription>
          </DialogHeader>
          {bookingSuccess && (
            <div className="space-y-4">
              <div className="flex justify-center p-4 bg-indigo-50 rounded-lg">
                <QRCode
                  value={JSON.stringify({
                    bookingId: bookingSuccess.id,
                    eventId: bookingSuccess.eventId,
                    seats: bookingSuccess.seats,
                  })}
                  size={200}
                />
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Booking ID:</strong> {bookingSuccess.id}</p>
                <p><strong>Seats:</strong> {bookingSuccess.seats?.join(', ')}</p>
                <p><strong>Total Amount:</strong> ${bookingSuccess.totalAmount}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const svg = document.querySelector('svg')
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
                        link.download = `ticket-${bookingSuccess.id}.png`
                        link.href = url
                        link.click()
                      }
                      img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
                    }
                  }}
                >
                  Download QR Code
                </Button>
                <Button onClick={() => navigate('/bookings')}>
                  View My Bookings
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EventDetail

