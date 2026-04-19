import { RouterProvider } from 'react-router'
import router from './app.routes.jsx'
import './App.css'
import { useAuth } from '../features/auth/hooks/useAuth.js'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

function App() {

  const { handleGetMe } = useAuth()

   const user = useSelector(state => state.auth.user)

  console.log(user)

  useEffect(() => {
    handleGetMe()
  }, [])

  return (
    <RouterProvider router={router} />
  )
}

export default App
