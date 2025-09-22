import React from "react";
import logo from "../../../assets/logo.png";
import "../CSS/Footer.css";
import { useNavigate } from 'react-router-dom'


const Footer = () => {
  const navigate = useNavigate()
  return (
    <footer className="footer">
      <div className="footer-left">
        <img src={logo} alt="Logo" className="footer-logo" />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta accusamus odio necessitatibus velit facere quas earum veritatis. Est vero ut animi temporibus cupiditate perspiciatis suscipit tempore atque veniam beatae? Culpa.
        </p>
        <p><strong>Mon - Sat:</strong> 8:00 - 18:00, Sunday Closed</p>
        <p><strong>Phone:</strong> +91 XXXXXXXXXX</p>
        <p><strong>Email:</strong> abc@gmail.yes</p>
        <p><strong>Address:</strong> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dignissimos perspiciatis voluptatibus maiores praesentium accusamus illo corporis dicta, quibusdam possimus velit?</p>
      </div>
      <div className="footer-center">
        <h3>Quick Links</h3>
        <ul>
            <li onClick={() => (navigate("/"))}>Home </li>
            <li onClick={() => (navigate("/shop"))}>Shop</li>
            <li onClick={() => {
              const section = document.getElementById("services");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
            }}>Services</li> 
                     <li onClick={() => (navigate("/about"))}>About</li>
            <li onClick={() => (navigate("/contact"))}>Contact</li>
        </ul>
      </div>
      <div className="footer-right">
        <h3>Contact</h3>
        <form>
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <input type="text" placeholder="Phone" required maxLength={10}/>
          <textarea placeholder="Feedback" rows="5" required ></textarea>
          <button type="submit">SUBMIT</button>
        </form>
      </div>
    </footer>
  );
};

export default Footer;
