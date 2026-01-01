import React, { useState,useRef,useEffect } from 'react'
import "../CSS/Navbar.css"
import logo from "../../../../public/assets/logo.png"
import { useNavigate } from 'react-router-dom'




const Navbar = () => {

  let navigate = useNavigate()
  const [hamburgerStatus, setHamburgerStatus] = useState(false)
    const [shopMenu, setShopMenu] = useState(false)
      const shopRef = useRef(null)

       useEffect(() => {
    const handleClickOutside = (e) => {
      if (shopRef.current && !shopRef.current.contains(e.target)) {
        setShopMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  function toggle() {
    setHamburgerStatus(!hamburgerStatus)
  }
  return (
    <>
      <div className='nav-main'>
        <nav className='navbar'>
          <img src={logo} alt="The Healing Star Logo" className='logo' onClick={() => (navigate("/"))}/>
          <ul className='topics'>
            <li onClick={() => (navigate("/"))}>Home </li>
                <li ref={shopRef} className="shop-item">
        <span onClick={() => setShopMenu(!shopMenu)}>
          Shop ▾
        </span>
          {shopMenu && (
          <ul className="shop-dropdown">
              <li onClick={()=>(navigate("/shop/bracelets"))}>Bracelets</li>
              <li onClick={()=>(navigate("/shop/pendant"))}>Pendants</li>
              <li onClick={()=>(navigate("/shop/sphere"))}>Balls/Sphere</li>
              <li onClick={()=>(navigate("/shop/salt"))}>Salt Lamp</li>
              <li onClick={()=>(navigate("/shop/rings"))}>Rings</li>
              <li onClick={()=>(navigate("/shop/earring"))}>Earrings</li>
              <li onClick={()=>(navigate("/shop/trees"))}>Trees</li>
              <li onClick={()=>(navigate("/shop/evileye"))}>Evil Eye</li>
            </ul>
        )}
        </li>

            <li onClick={() => (navigate("/",{state:{scrollTo:"services"}}))}>Services</li>
            <li onClick={() => (navigate("/about"))}>About</li>
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
