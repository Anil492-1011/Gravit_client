import { io } from 'socket.io-client'

const SOCKET_URL = 'https://gravitserver-production.up.railway.app'

let socket = null

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    })
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => {
  if (!socket) {
    return connectSocket()
  }
  return socket
}

export const joinEventRoom = (eventId) => {
  const s = getSocket()
  s.emit('joinEvent', eventId)
}

export const lockSeat = (eventId, seatIndex, userId) => {
  const s = getSocket()
  s.emit('lockSeat', { eventId, seatIndex, userId })
}

export const unlockSeat = (eventId, seatIndex, userId) => {
  const s = getSocket()
  s.emit('unlockSeat', { eventId, seatIndex, userId })
}

export const onSeatLocked = (callback) => {
  const s = getSocket()
  s.on('seatLocked', callback)
  return () => s.off('seatLocked', callback)
}

export const onSeatUnlocked = (callback) => {
  const s = getSocket()
  s.on('seatUnlocked', callback)
  return () => s.off('seatUnlocked', callback)
}

export const onSeatLockFailed = (callback) => {
  const s = getSocket()
  s.on('seatLockFailed', callback)
  return () => s.off('seatLockFailed', callback)
}

export const onLockedSeats = (callback) => {
  const s = getSocket()
  s.on('lockedSeats', callback)
  return () => s.off('lockedSeats', callback)
}

