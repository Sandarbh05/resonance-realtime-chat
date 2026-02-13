import React from 'react'

function Logo({width= '', className=''}) {
  return (
    <div>
      <img 
      src='/Resonance Logo.svg'
      alt='Resonance Logo'
      style={{ width }}
      className={`rounded-3xl ${className} `}
      />
    </div>
  )
}

export default Logo