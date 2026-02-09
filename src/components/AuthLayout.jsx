// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { useNavigate, useLocation } from 'react-router-dom'

// export default function AuthLayout({ children }) {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const [loader, setLoader] = useState(true)

//   const authStatus = useSelector(state => state.auth.status)
//   const profileCompleted = useSelector(state => state.auth.profileCompleted)

//   useEffect(() => {
//     // 🔹 WAIT for auth hydration
//     if (authStatus === null) return

//     // 🔹 Not logged in
//     if (authStatus === false) {
//       if (location.pathname !== '/login' && location.pathname !== '/signup') {
//         navigate('/login')
//       }
//       setLoader(false)
//       return
//     }

//     // 🔹 Logged in, profile NOT completed
//     if (authStatus === true && !profileCompleted) {
//       if (location.pathname !== '/profile-setup') {
//         navigate('/profile-setup')
//       }
//       setLoader(false)
//       return
//     }

//     // 🔹 Logged in, profile completed
//     if (authStatus === true && profileCompleted) {
//       if (location.pathname === '/profile-setup') {
//         navigate('/chat')
//       }
//       setLoader(false)
//       return
//     }

//     setLoader(false)
//   }, [authStatus, profileCompleted, location.pathname, navigate])

//   if (loader || authStatus === null) {
//     return <h1>Loading...</h1>
//   }

//   return <>{children}</>
// }


import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'

export default function AuthLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const authStatus = useSelector(state => state.auth.status)
  const profileCompleted = useSelector(state => state.auth.profileCompleted)

  useEffect(() => {
    // 🔒 Wait for App.jsx hydration
    if (authStatus === null) return

    // 🚫 Not authenticated
    if (authStatus === false) {
      if (location.pathname !== '/login' && location.pathname !== '/signup') {
        navigate('/login', { replace: true })
      }
      return
    }

    // 🧱 Authenticated, profile not complete
    if (!profileCompleted) {
      if (location.pathname !== '/profile-setup') {
        navigate('/profile-setup', { replace: true })
      }
      return
    }

    // ✅ Authenticated + profile complete
    if (location.pathname === '/profile-setup') {
      navigate('/chat', { replace: true })
    }
  }, [authStatus, profileCompleted, location.pathname, navigate])

  // Block rendering until auth is known
  if (authStatus === null) return null

  return <>{children}</>
}
