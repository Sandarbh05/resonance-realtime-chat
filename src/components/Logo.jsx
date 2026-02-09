import React from 'react'

function Logo({width= '120px', className=''}) {
  return (
    <div>
      <img 
      src='/Resonance-Logo.png'
      alt='Resonance Logo'
      style={{ width }}
      className={`rounded-3xl ${className} `}
      />
    </div>
  )
}

export default Logo