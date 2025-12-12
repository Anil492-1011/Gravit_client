import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserBookings } from '@/store/bookingSlice'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import  QRCode  from 'qrcode.react'
import { Calendar, MapPin, Ticket, Download } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'

const Bookings = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { bookings, loading } = useSelector((state) => state.bookings)
  const { user } = useSelector((state) => state.auth)
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

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

  if (loading) {
    return <div className="text-center py-12">Loading bookings...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
        <p className="text-slate-600 mt-2">View and manage your event bookings</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-slate-600 mb-4">No bookings yet</p>
            <Button onClick={() => navigate('/events')}>Browse Events</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                {booking.img && (
                  <div className="h-48 overflow-hidden rounded-t-lg">
                    <img src={booking.img} alt={booking.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{booking.title || 'Event'}</CardTitle>
                  <CardDescription>
                    <span className={`px-2 py-1 text-xs rounded-full inline-block ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {booking.location && (
                    <div className="flex items-center text-slate-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{booking.location}</span>
                    </div>
                  )}
                  {booking.date && (
                    <div className="flex items-center text-slate-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center text-slate-600">
                    <Ticket className="h-4 w-4 mr-2" />
                    <span className="text-sm">Seats: {booking.seats?.join(', ') || 'N/A'}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-lg font-bold text-indigo-600">${booking.totalAmount}</p>
                  </div>
                </CardContent>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => handleViewQR(booking)}
                  >
                    View QR Ticket
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Ticket</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div id="qr-code" className="flex justify-center p-4 bg-indigo-50 rounded-lg">
                <QRCode
                  value={JSON.stringify({
                    bookingId: selectedBooking.id,
                    eventId: selectedBooking.eventId,
                    seats: selectedBooking.seats,
                  })}
                  size={200}
                />
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Booking ID:</strong> {selectedBooking.id}</p>
                <p><strong>Event:</strong> {selectedBooking.title || 'Event'}</p>
                <p><strong>Seats:</strong> {selectedBooking.seats?.join(', ')}</p>
                <p><strong>Total Amount:</strong> ${selectedBooking.totalAmount}</p>
              </div>
              <Button onClick={handleDownloadQR} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Bookings

