import { useDispatch, useSelector } from 'react-redux'
import { hideToast } from '@/store/uiSlice'
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitleAndDescription,
  ToastClose,
} from './toast'
import { useEffect } from 'react'

export function Toaster() {
  const dispatch = useDispatch()
  const toast = useSelector((state) => state.ui.toast)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(hideToast())
      }, toast.duration || 3000)
      return () => clearTimeout(timer)
    }
  }, [toast, dispatch])

  if (!toast) return null

  return (
    <ToastProvider>
      <ToastViewport>
        <Toast className={toast.variant === 'destructive' ? 'destructive' : ''}>
          <ToastTitleAndDescription
            title={toast.title}
            description={toast.description}
          />
          <ToastClose onClick={() => dispatch(hideToast())} />
        </Toast>
      </ToastViewport>
    </ToastProvider>
  )
}

