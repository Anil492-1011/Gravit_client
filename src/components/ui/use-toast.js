import { useDispatch } from 'react-redux'
import { showToast, hideToast } from '@/store/uiSlice'

export const useToast = () => {
  const dispatch = useDispatch()

  const toast = ({ title, description, variant = 'default' }) => {
    dispatch(showToast({ title, description: description || title, variant }))
  }

  return { toast }
}

