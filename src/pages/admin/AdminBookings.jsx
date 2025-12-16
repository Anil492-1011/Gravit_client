import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllBookings, updateBooking } from '@/store/bookingSlice'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

const AdminBookings = () => {
  const dispatch = useDispatch()
  const { bookings, loading } = useSelector((state) => state.bookings)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchAllBookings())
  }, [dispatch])

  const handleStatusChange = async (bookingId, newStatus) => {
    const result = await dispatch(updateBooking({ id: bookingId, status: newStatus }))
    if (result.type === 'bookings/updateBooking/fulfilled') {
      toast({
        title: 'Success',
        description: 'Booking status updated',
      })
    } else {
      toast({
        title: 'Error',
        description: result.payload || 'Failed to update booking',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">All Bookings</h1>
        <p className="text-slate-600 mt-2">Manage and view all bookings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600">No bookings found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking, index) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TableCell className="font-medium">#{booking.id}</TableCell>
                    <TableCell>{booking.title || 'Event'}</TableCell>
                    <TableCell>{booking.name || booking.email || 'N/A'}</TableCell>
                    <TableCell>{booking.seats?.join(', ') || 'N/A'}</TableCell>
                    <TableCell>₹{booking.totalAmount}</TableCell>
                    <TableCell>
                      <Select
                        value={booking.status}
                        onValueChange={(value) => handleStatusChange(booking.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminBookings

