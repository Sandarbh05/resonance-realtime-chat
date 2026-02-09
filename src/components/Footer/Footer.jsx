// import React from 'react'
// import { useLocation } from 'react-router-dom'

// function Footer() {
//     const location=useLocation();
//     console.log(location);
    
//     return (
//         (location.pathname=='/chat' || location.pathname=='/') ?
//         null :
//         <footer className="text-center text-md text-[#AAC1D0] absolute left-[42vw] bottom-2" style={{fontFamily: "Serif"}}>
//             <p className=''>© 2026 Resonance. All rights reserved.</p>
//             <p className=''>Resonance v1.26.0.1</p>
//         </footer>
//     )
// }

// export default Footer
import React from 'react'
import { useLocation } from 'react-router-dom'

function Footer() {
  const location = useLocation();
  const { pathname } = location;

  // hide footer if path includes /chat OR is home
  if (pathname.includes('/chat')) {
    return null;
  }

  return (
    <footer
      className="text-center text-md text-[#AAC1D0] absolute left-[42vw] bottom-2"
      style={{ fontFamily: "Serif" }}
    >
      <p>© 2026 Resonance. All rights reserved.</p>
      <p>Resonance v1.26.0.1</p>
    </footer>
  );
}

export default Footer;
