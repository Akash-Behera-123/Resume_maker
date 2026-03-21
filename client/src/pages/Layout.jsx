import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'
import Login from './Login'

const Layout = () => {
  const { user, loading } = useSelector(state => state.auth)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {
        user ? (
          <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <Outlet />
          </div>
        )
        : <Login />
      }
    </div>
  )
}

export default Layout