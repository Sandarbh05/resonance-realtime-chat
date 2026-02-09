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
  <header>

  {/* Logo Display Logic :  */}
  { location.pathname=="/" ?
  <Logo className='mx-auto pt-10' width="430px" /> :
  <div className='flex'>
    <Logo className='inline-block mt-3'/>  
    <img
      className='inline-block'
      src='/Resonance-Style-Text.png'
      alt=''
    />
  </div>
  }
  

  <nav>
    {authStatus ? (
      <>
        <LogoutBtn />
      </>
    ) : (
      <div>    
        { location.pathname=="/" ?
        <Button
          className="hover:bg-[#26a63e] absolute left-[43vw] top-[75vh] w-[230px]"
          bgColor='bg-[#2cbc46]'
          textColor='text-white'
          style={{fontFamily: '"Londrina Solid", cursive'}}
          onClick={() => navigate('/signup')}
        >
        <img 
         src="/New-Tab-Icon.png"
         alt="X"
         className="inline-block size-8 p-0 m-0"         
        />
        <p className='inline-block p-1 text-xl'>Get started</p>
        </Button> : 
        <div className='absolute top-[5vh] right-[2vw] space-x-5'>
        <Button 
        className='border border-white bg-transparent rounded-[20px] hover:bg-blue-600 text-2xl w-[8vw]'
        onClick={() => navigate('/login')}>
          Login
        </Button>
        <Button
        className='border border-white bg-transparent rounded-[20px] hover:bg-blue-600 text-2xl w-[8vw]'
        onClick={()=> navigate('/login')}>
          Signup
        </Button>
        </div>
        }
        
      </div>
    )}
  </nav>
</header>
)
}

export default Header   