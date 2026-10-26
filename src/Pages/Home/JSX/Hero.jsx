// import React from 'react'
// import hero from "../../../../public/assets/hero.jpeg"
// import "../CSS/Hero.css"

// const Hero = () => {
//   return (
//     <section className="hero-section">
//       <div className="hero-image-wrapper">
//         <img
//           className="hero-image"
//           src={hero}
//           alt="Healing Star"
//         />
//       </div>
//     </section>
//   )
// }

// export default Hero


import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "../../../../public/assets/hero.jpeg";
import "../CSS/Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="home-hero">
      <img
        className="home-hero-image"
        src={heroImage}
        alt="Natural crystals and meaningful jewellery from The Healing Star"
        fetchPriority="high"
      />

      <div className="home-hero-overlay" />

      <div className="home-hero-content">
        <span className="home-hero-eyebrow">
          <Sparkles size={15} />
          YOUR JOURNEY TO INNER BALANCE
        </span>

        <h1>
          Heal. Balance.
          <span>Manifest.</span>
        </h1>

        <p>
          Discover natural crystals, handcrafted jewellery and
          spiritual services thoughtfully chosen for your journey.
        </p>

        <div className="home-hero-actions">
          <button
            type="button"
            className="home-button home-button-primary"
            onClick={() => navigate("/shop/bracelets")}
          >
            Explore Collections
            <ArrowRight size={17} />
          </button>

          <button
            type="button"
            className="home-button home-button-secondary"
            onClick={() =>
              document.getElementById("home-services")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Discover Our Services
          </button>
        </div>

        <div className="home-hero-note">
          Thoughtfully curated for your well-being
        </div>
      </div>

      <div className="home-hero-side-note">
        THE HEALING STAR · SINCE YOUR JOURNEY BEGINS
      </div>
    </section>
  );
};

export default Hero;
