import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createEvent } from '@/store/eventSlice'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'

const CreateEvent = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { toast } = useToast()
  const fileInputRef = useRef(null)

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    totalSeats: '',
    price: '',
    status: 'upcoming',
    image: '',
  })

  const [imagePreview, setImagePreview] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result
      setFormData({ ...formData, image: base64String })
      setImagePreview(base64String)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setFormData({ ...formData, image: '' })
    setImagePreview('')
    if (fileInputRef.current) {
        fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    const eventData = {
      ...formData,
      totalSeats: parseInt(formData.totalSeats),
      price: parseFloat(formData.price),
    }

    try {
        const result = await dispatch(createEvent(eventData)).unwrap()
        toast({
            title: 'Success',
            description: 'Event created successfully',
        })
        navigate('/admin/events')
    } catch (error) {
        toast({
            title: 'Error',
            description: typeof error === 'string' ? error : 'Failed to create event',
            variant: 'destructive',
        })
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Create New Event</h1>
        <p className="text-slate-600 mt-2">Add a new event to your system</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Fill in the information for your new event</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label>Event Image</Label>
                <div 
                    className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[240px] transition-colors
                        ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}
                        ${imagePreview ? 'border-none p-0 bg-slate-100' : ''}
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {imagePreview ? (
                        <div className="relative w-full h-full min-h-[300px]">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg max-h-[400px]" />
                            <Button 
                                type="button"
                                variant="destructive" 
                                size="icon" 
                                className="absolute top-4 right-4 rounded-full shadow-lg"
                                onClick={removeImage}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="p-4 bg-slate-100 rounded-full inline-block">
                                <ImageIcon className="h-8 w-8 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700">
                                    <button 
                                        type="button" 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-indigo-600 hover:text-indigo-700 hover:underline"
                                    >
                                        Click to upload
                                    </button>
                                    {' '}or drag and drop
                                </p>
                                <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max 5MB)</p>
                            </div>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g. Summer Music Festival"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Central Park, NY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalSeats">Total Seats *</Label>
                  <Input
                    id="totalSeats"
                    type="number"
                    min="1"
                    value={formData.totalSeats}
                    onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Ticket ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="flex min-h-[120px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your event..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Creating Event...' : 'Create Event'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/admin/events')} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default CreateEvent
