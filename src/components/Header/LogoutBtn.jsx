import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function LogoutBtn() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const authStatus = useSelector(state => state.auth.status)

  // 🔒 Rule: logout button exists ONLY if authenticated
  if (authStatus !== true) return null

  const logoutHandler = async () => {
    try {
      await authService.logout()
    } finally {
      // 🔑 hard reset of auth state
      dispatch(logout())
      navigate('/login', { replace: true })
    }
  }

  return (
    <button className="border px-4 py-2 border-white bg-transparent rounded-full hover:bg-blue-600 text-sm sm:text-base" onClick={logoutHandler}>
      Logout
    </button>
  )
}

export default LogoutBtn
