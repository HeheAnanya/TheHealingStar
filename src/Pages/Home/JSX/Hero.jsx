import React from 'react'
import hero from "../../../../public/assets/hero.jpeg"
import "../CSS/Hero.css"

const Hero = () => {
  return (
    <div>
        <img src= {hero} alt='hero'/>
    </div>
  )
}

export default Hero