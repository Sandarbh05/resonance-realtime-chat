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
      className="w-full text-center text-xs md:text-md text-[#AAC1D0]"
      style={{ fontFamily: "Serif" }}
    >
      <p>© 2026 Resonance. All rights reserved.</p>
      <p>Resonance v1.26.0.1</p>
    </footer>
  );
}

export default Footer;
