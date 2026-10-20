import React from 'react'
import hero from "../../../../public/assets/hero.jpeg"
import "../CSS/Hero.css"

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-image-wrapper">
        <img
          className="hero-image"
          src={hero}
          alt="The Healing Star"
        />
      </div>
    </section>
  )
}

export default Hero
