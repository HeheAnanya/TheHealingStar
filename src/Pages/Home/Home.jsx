import React from 'react'
import Navbar from './JSX/Navbar'
import Footer from './JSX/Footer'
import Testimonial from './JSX/Testimonial'
import Hero from './JSX/Hero'
import Services from '../Services/Services'
import "./Home.css"
const Home = () => {
  return (
    <div>
        <Navbar/>
        <Hero/>
        <Services/>
        <section className="section-divider">
  <h2>✨ Hear From Our Clients ✨</h2>
  <p>Real stories of healing, clarity and balance</p>
</section>
        <Testimonial/>
        <Footer/>
    </div>
  )
}

export default Home