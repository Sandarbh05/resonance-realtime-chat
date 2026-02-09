import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

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
    <div className="flex flex-col text-center items-center" style={{ fontFamily: '"Londrina Solid", cursive' }}>
      <img
      src='/Resonance-Style-Text.png'
      alt='Resonance' 
      className='w-lg mt-[-48px]'
      />
      <p className="text-[96px] mt-[-60px]">Real-time chat, simplified.</p>
      <p className="text-[36px] mt-[-20px]">Conversations that resonates. They matter.</p>
    </div>
  )
}

export default Home
