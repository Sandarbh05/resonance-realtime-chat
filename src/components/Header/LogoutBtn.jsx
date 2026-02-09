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
    <button className="border border-white bg-transparent rounded-2xl hover:bg-blue-600 text-2xl w-[8vw] p-1 absolute top-[5vh] right-[2vw]" onClick={logoutHandler}>
      Logout
    </button>
  )
}

export default LogoutBtn
