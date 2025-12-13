import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { register, clearError } from '@/store/authSlice'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error, user } = useSelector((state) => state.auth)
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState('user')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    ConfirmPassword: '',
  })

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
    }
  }, [user, navigate])

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      })
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const result = await dispatch(register(formData))
    
    if (result.type === 'auth/register/fulfilled') {
      toast({
        title: 'Success',
        description: 'Account created successfully!',
      })
      if (result.payload.user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="space-y-1 pb-6">
            {/* Tab Switcher */}
            <div className="flex w-full mb-6 border-b">
              <button
                type="button"
                onClick={() => setActiveTab('user')}
                className={`flex-1 pb-2 text-sm transition-all ${
                  activeTab === 'user'
                    ? 'border-b-2 border-indigo-600 font-bold text-indigo-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`flex-1 pb-2 text-sm transition-all ${
                  activeTab === 'admin'
                    ? 'border-b-2 border-indigo-600 font-bold text-indigo-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Admin
              </button>
            </div>

            <CardTitle className="text-2xl font-bold text-center text-slate-900">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Join us and start booking amazing events
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="rounded-md"
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="ConfirmPassword">ConfirmPassword</Label>
                <Input
                  id="Confirmpassword"
                  type="Confirmpassword"
                  placeholder="Minimum 6 characters"
                  value={formData.ConfirmPassword}
                  onChange={(e) => setFormData({ ...formData, ConfirmPassword: e.target.value })}
                  required
                  className="rounded-md"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-2">
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full">
                <Button type="submit" className="w-full shadow-sm rounded-md" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </motion.div>
              <p className="text-sm text-center text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

export default Register

