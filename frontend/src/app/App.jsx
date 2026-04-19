import { RouterProvider } from 'react-router'
import router from './app.routes.jsx'
import './App.css'
import { useAuth } from '../features/auth/hooks/useAuth.js'
import { useEffect } from 'react'

function App() {

  const { handleGetMe } = useAuth()

  useEffect(() => {
    handleGetMe()
  }, [])

  return (
    <RouterProvider router={router} />
  )
}

export default App
