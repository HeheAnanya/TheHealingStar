import React, { useState } from 'react'
import "../CSS/Navbar.css"
import logo from "../../../assets/logo.png"
import { useNavigate } from 'react-router-dom'




const Navbar = () => {
  let navigate = useNavigate()
  const [hamburgerStatus, setHamburgerStatus] = useState(false)
  function toggle() {
    setHamburgerStatus(!hamburgerStatus)
  }
  return (
    <>
      <div className='nav-main'>
        <nav className='navbar'>
          <img src={logo} alt="The Healing Star Logo" className='logo' />
          <ul className='topics'>
            <li onClick={() => (navigate("/"))}>Home </li>
            <li onClick={() => (navigate("/shop"))}>Shop</li>
            <li onClick={() => {
              const section = document.getElementById("services");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
            }}>Services</li>          <li onClick={() => (navigate("/about"))}>About</li>
            <li onClick={() => (navigate("/contact"))}>Contact</li>

          </ul>
          <div className="hamburger" onClick={toggle}>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
          </div>
        </nav>

      </div>

    </>
  )
}

export default Navbar




// 
