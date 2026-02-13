import React from 'react'
import {Container, Logo, LogoutBtn} from '../index.js'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux' 
import { useNavigate } from 'react-router-dom'
import {Button} from '../index.js'
import { useLocation } from 'react-router-dom'

function Header() {
    const authStatus = useSelector((state)=> state.auth.status);
    const navigate=useNavigate();
    const location = useLocation();


return(
  <header className="w-full flex items-center justify-between px-4 py-3">

  {location.pathname !== "/" && (
    <div className="flex items-center gap-3">
      <Logo className="w-24 sm:w-32" />
      <img
        src="/Resonance Style Text.svg"
        alt=""
        className="hidden sm:block w-60"
        />
    </div>
  )}

  <nav className="flex items-center gap-4">
    {authStatus ? (
      <LogoutBtn />
    ) : (
      location.pathname !== "/" && (
        <>
          <Button
            className="border px-4 py-2 border-white bg-transparent rounded-full hover:bg-blue-600 text-sm sm:text-base"
            onClick={() => navigate('/login')}
            >
            Login
          </Button>

          <Button
            className="border px-4 py-2 border-white bg-transparent rounded-full hover:bg-blue-600 text-sm sm:text-base"
            onClick={() => navigate('/signup')}
            >
            Signup
          </Button>
        </>
      )
    )}
  </nav>

</header>

)
}

export default Header   