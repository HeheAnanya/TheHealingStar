import React, { useState, useRef, useEffect } from "react";
import "../CSS/Navbar.css";
import logo from "../../../../public/assets/logo.png";
import { useNavigate } from "react-router-dom";
import { UserRound, Menu, X } from "lucide-react";
import Login from "./Login";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [hamburgerStatus, setHamburgerStatus] = useState(false);
  const [shopMenu, setShopMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const shopRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shopRef.current && !shopRef.current.contains(event.target)) {
        setShopMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = showLogin ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showLogin]);

  const toggle = () => {
    setHamburgerStatus((prev) => !prev);
    setShopMenu(false);
  };

  const handleNavigate = (path, state) => {
    setHamburgerStatus(false);
    setShopMenu(false);
    navigate(path, state);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setHamburgerStatus(false);
    setShopMenu(false);
    navigate("/");
  };

  const handleLoginOpen = () => {
    setHamburgerStatus(false);
    setShopMenu(false);
    setShowLogin(true);
  };

  return (
    <>
      <div className="nav-main">
        <nav className="navbar">
          <img
            src={logo}
            alt="The Healing Star Logo"
            className="logo"
            onClick={() => handleNavigate("/")}
          />

          <button
            type="button"
            className="hamburger"
            aria-label={hamburgerStatus ? "Close menu" : "Open menu"}
            aria-expanded={hamburgerStatus}
            onClick={toggle}
          >
            {hamburgerStatus ? <X size={27} /> : <Menu size={27} />}
          </button>

          <ul className={`topics ${hamburgerStatus ? "topics-active" : ""}`}>
            <li onClick={() => handleNavigate("/")}>Home</li>

            <li ref={shopRef} className="shop-item">
              <button
                type="button"
                className="shop-toggle"
                aria-expanded={shopMenu}
                onClick={() => setShopMenu((prev) => !prev)}
              >
                Shop <span>{shopMenu ? "▴" : "▾"}</span>
              </button>

              {shopMenu && (
                <ul className="shop-dropdown">
                  <li onClick={() => handleNavigate("/shop/bracelets")}>
                    Bracelets
                  </li>
                  <li onClick={() => handleNavigate("/shop/pendant")}>
                    Pendants
                  </li>
                  <li onClick={() => handleNavigate("/shop/sphere")}>
                    Balls/Sphere
                  </li>
                  <li onClick={() => handleNavigate("/shop/salt")}>
                    Salt Lamp
                  </li>
                  <li onClick={() => handleNavigate("/shop/rings")}>
                    Rings
                  </li>
                  <li onClick={() => handleNavigate("/shop/earring")}>
                    Earrings
                  </li>
                  <li onClick={() => handleNavigate("/shop/trees")}>
                    Trees
                  </li>
                  <li onClick={() => handleNavigate("/shop/evileye")}>
                    Evil Eye
                  </li>
                </ul>
              )}
            </li>

            <li
              onClick={() =>
                handleNavigate("/", { state: { scrollTo: "services" } })
              }
            >
              Services
            </li>

            <li onClick={() => handleNavigate("/about")}>About</li>

            <li onClick={() => handleNavigate("/contact")}>Contact</li>

            {!token ? (
              <li className="profile-item">
                <button
                  type="button"
                  className="profile-icon-btn"
                  aria-label="Login to your account"
                  onClick={handleLoginOpen}
                >
                  <UserRound size={23} strokeWidth={1.6} />
                  <span className="profile-login-text">Login</span>
                </button>
              </li>
            ) : (
              <>
                <li onClick={() => handleNavigate("/order/my")}>
                  My Orders
                </li>

                <li onClick={handleLogout}>Logout</li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {showLogin && (
        <Login
          isModal={true}
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
};

export default Navbar;