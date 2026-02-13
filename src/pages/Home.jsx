import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button } from '../components/index.js'
import { Logo } from '../components/index.js'

function Home() {
  const navigate = useNavigate()

  const authStatus = useSelector(state => state.auth.status)
  const profileCompleted = useSelector(state => state.auth.profileCompleted)

  useEffect(() => {
    // 🔹 wait until hydration is done
    if (authStatus === null) return

    if (authStatus && profileCompleted) {
      navigate('/chat', { replace: true })
    }

    if (authStatus && !profileCompleted) {
      navigate('/profile-setup', { replace: true })
    }
  }, [authStatus, profileCompleted, navigate])

  return (
    <div
  className="w-full max-w-5xl mx-auto flex flex-col items-center text-center gap-2 sm:gap-2 pt-10 sm:pt-16"
  style={{ fontFamily: '"Londrina Solid", cursive' }}
>
  <Logo className="w-40 sm:w-52 md:w-64 lg:w-72" />

  <img
    src="/Resonance Style Text.svg"
    alt="Resonance"
    className="w-4/5 sm:w-3/4 md:w-1/2 lg:w-2xl max-w-3xl"
  />

  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold">
    Real-time chat, simplified.
  </p>

  <p className="text-lg sm:text-xl md:text-xl text-gray-300 max-w-2xl">
    Conversations that resonate. They matter.
  </p>

  <Button
    className="hover:bg-[#26a63e] w-48 sm:w-56 h-11 text-lg"
    bgColor="bg-[#2cbc46]"
    textColor="text-white"
    style={{ fontFamily: '"Londrina Solid", cursive' }}
    onClick={() => navigate('/signup')}
  >
    <div className="flex items-center justify-center gap-2">
      <img
        src="/New-Tab-Icon.png"
        alt="X"
        className="size-5 sm:size-6"
      />
      <span>Get Started</span>
    </div>
  </Button>
</div>

  )
}

export default Home
