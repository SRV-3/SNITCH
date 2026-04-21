import { RouterProvider } from 'react-router'
import router from './app.routes.jsx'
import './App.css'
import { useAuth } from '../features/auth/hooks/useAuth.js'
import { useCart } from '../features/cart/hooks/useCart.js'
import { useEffect } from 'react'

function App() {

  const { handleGetMe } = useAuth()
  const { handleGetCart } = useCart()

  useEffect(() => {
    handleGetMe()
    handleGetCart()
  }, [])

  return (
    <RouterProvider router={router} />
  )
}

export default App
