import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth'
import service from './appwrite/config'
import { login, logout } from './store/authSlice'
import { Outlet } from 'react-router-dom'
import { Header, Footer } from './components'

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

  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App
