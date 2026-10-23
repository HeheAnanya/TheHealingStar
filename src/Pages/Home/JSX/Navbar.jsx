import React, { useState, useRef, useEffect } from "react";
import "../CSS/Navbar.css";
import logo from "../../../../public/assets/logo.png";
import { useNavigate } from "react-router-dom";
import { UserRound, Menu, X, ShoppingBag } from "lucide-react";
import { api } from "../../../api/axios";
import Login from "./Login";
import Signup from "./Signup";

const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    let active = true;
    const refreshSession = () => {
      api.get("/auth/me").then((res) => { if (active) setUser(res.data.user); }).catch(() => { if (active) setUser(null); });
      api.get("/cart").then((res) => { if (active) setCartCount((res.data?.items || []).reduce((sum, item) => sum + item.quantity, 0)); }).catch(() => { if (active) setCartCount(0); });
    };
    refreshSession();
    window.addEventListener("auth-changed", refreshSession);
    return () => { active = false; window.removeEventListener("auth-changed", refreshSession); };
  }, []);

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
    api.post("/auth/logout").catch(() => { });
    localStorage.removeItem("token");
    setUser(null);
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

            <li className="nav-cart-item"><span role="link" tabIndex={0} className="nav-cart-link" aria-label="Open cart" onClick={() => handleNavigate("/cart")} onKeyDown={(e) => e.key === "Enter" && handleNavigate("/cart")}><ShoppingBag size={19} />{cartCount > 0 && <span className="nav-cart-count">{cartCount}</span>}</span></li>

            <li className="profile-item">
              <span
                role="link"
                tabIndex={0}
                className="profile-icon-link"
                aria-label={user ? "Open your profile" : "Login to your account"}
                onClick={() => user ? handleNavigate("/profile") : handleLoginOpen()}
                onKeyDown={(e) => e.key === "Enter" && (user ? handleNavigate("/profile") : handleLoginOpen())}
              >
                <UserRound size={21} strokeWidth={1.6} />
                {/* <span className="profile-login-text">{user}</span> */}
              </span>
            </li>

            {user && (
              <>
                <li onClick={() => handleNavigate("/order/my")}>My Orders</li>
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
          onSignupClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}


        />
      )}
      {showSignup && (
        <Signup
          isModal={true}
          onClose={() => setShowSignup(false)}
          onLoginClick={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
};

export default Navbar;