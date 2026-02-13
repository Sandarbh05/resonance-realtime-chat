import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth'
import service from './appwrite/config'
import { login, logout } from './store/authSlice'
import { Outlet } from 'react-router-dom'
import { Header, Footer } from './components'
import { useLocation } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const authUser = await authService.getCurrentUser()
        if (!mounted) return

        if (!authUser) {
          dispatch(logout())
        } else {
          const profile = await service.getUserProfile(authUser.$id)

          dispatch(
            login({
              userData: authUser,
              profile,
            })
          )
        }
      } catch (error) {
        console.error(error)
        dispatch(logout())
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    return () => {
      mounted = false
    }
  }, [dispatch])

  if (loading) return null


  const location = useLocation();
  const isChat = location.pathname.startsWith("/chat");

  return (

    <div className="min-h-[94vh] sm:min-h-screen flex flex-col w-full" >
      <Header />

      <main className="flex flex-1 w-full px-4">
        {isChat ? (
          <div className="flex flex-col w-full h-full min-h-0">
            <Outlet />
          </div>
        ) : (
          <div className="max-w-xl w-full mx-auto min-h-0">
            <Outlet />
          </div>
        )}
      </main>


      <Footer />
    </div>

  )
}

export default App
