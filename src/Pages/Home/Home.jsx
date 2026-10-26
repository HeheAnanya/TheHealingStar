// // import React,{useEffect} from 'react'
// // import { useLocation } from "react-router-dom";

// // import Navbar from './JSX/Navbar'
// // import Footer from './JSX/Footer'
// // import Testimonial from './JSX/Testimonial'
// // import Hero from './JSX/Hero'
// // import Services from '../Services/Services'
// // import "./Home.css"
// // const Home = () => {
// //     const location = useLocation();

// //   useEffect(() => {
// //     if (location.state?.scrollTo === "services") {
// //       const section = document.getElementById("services");
// //       if (section) {
// //         section.scrollIntoView({ behavior: "smooth" });
// //       }
// //     }
// //   }, [location])  
// //   return (
// //     <div>
// //         <Navbar/>
// //         <Hero/>
// //         <Services/>
// //         <section className="section-divider">
// //   <h2>Hear From Our Clients</h2>
// //   <p>Real stories of healing, clarity and balance</p>
// // </section>
// //         <Testimonial/>
// //         <Footer/>
// //     </div>
// //   )
// // }

// // export default Home
// import React, { useEffect } from "react";
// import { useLocation } from "react-router-dom";

// import Navbar from "./JSX/Navbar";
// import Footer from "./JSX/Footer";
// import Testimonial from "./JSX/Testimonial";
// import Hero from "./JSX/Hero";
// import Services from "../Services/Services";
// import "./Home.css";

// const Home = () => {
//   const location = useLocation();

//   useEffect(() => {
//     if (location.state?.scrollTo === "services") {
//       const section = document.getElementById("services");
//       if (section) {
//         section.scrollIntoView({ behavior: "smooth" });
//       }
//     }
//   }, [location]);

//   return (
//     <div>
//       <Navbar />
//       <Hero />
//       <Services />

//       <section className="section-divider">
//         <h2>Hear From Our Clients</h2>
//         <p>Real stories of healing, clarity and balance</p>
//       </section>

//       <Testimonial />
//       <Footer />
//     </div>
//   );
// };

// // export default Home;

import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

import Navbar from "./JSX/Navbar";
import Footer from "./JSX/Footer";
import Testimonial from "./JSX/Testimonial";
import Hero from "./JSX/Hero";
import Services from "../Services/Services";
import productData from "../Shop/data";
import ProductCard from "../Shop/JSX/ProductCard";

import "./Home.css";

const categories = [
  { key: "bracelets", label: "Crystal Bracelets" },
  { key: "rings", label: "Crystal Rings" },
  { key: "earring", label: "Earrings" },
  { key: "pendant", label: "Pendants" },
  { key: "salt", label: "Salt Lamps" },
  { key: "sphere", label: "Crystal Spheres" },
  { key: "trees", label: "Gemstone Trees" },
  { key: "evileye", label: "Evil Eye" },
];

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const featuredProducts = useMemo(() => {
    return Object.entries(productData)
      .flatMap(([category, items]) =>
        (items || []).map((product) => ({ ...product, category }))
      )
      .slice(0, 8);
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo === "services") {
      window.setTimeout(() => {
        document.getElementById("home-services")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [location]);

  return (
    <div className="home-page">
      <Navbar />

      <Hero />

      <section className="home-promises" aria-label="Our promises">
        <div className="home-promise">
          <Sparkles size={23} />
          <div>
            <h3>Thoughtfully Curated</h3>
            <p>Meaningful pieces for your journey</p>
          </div>
        </div>

        <div className="home-promise">
          <Sparkles size={23} />
          <div>
            <h3>Natural Crystals</h3>
            <p>Discover your personal favourites</p>
          </div>
        </div>

        <div className="home-promise">
          <Sparkles size={23} />
          <div>
            <h3>Spiritual Wellness</h3>
            <p>Explore services for self-discovery</p>
          </div>
        </div>
      </section>

      <section className="home-section home-categories">
        <div className="home-section-heading">
          <span className="home-section-eyebrow">FIND YOUR FAVOURITE</span>
          <h2>Shop by Category</h2>
          <p>Explore meaningful pieces to make your own.</p>
        </div>

        <div className="home-category-grid">
          {categories.map((category) => {
            const products = productData[category.key] || [];
            const image = products[0];

            if (!image) return null;

            return (
              <button
                type="button"
                className="home-category-card"
                key={category.key}
                onClick={() => navigate(`/shop/${category.key}`)}
              >
                <img
                  src={image.src}
                  alt={category.label}
                  loading="lazy"
                />
                <span className="home-category-label">
                  {category.label}
                  <ArrowRight size={17} />
                </span>
              </button>
            );
          })}
        </div>

        <div className="home-section-action">
          <button
            type="button"
            className="home-text-link"
            onClick={() => navigate("/shop/bracelets")}
          >
            Explore all collections <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section
        className="home-services-section"
        id="home-services"
      >
        <div className="home-services-intro">
          <span className="home-section-eyebrow">BEYOND THE EVERYDAY</span>
          <h2>Guidance for Your Journey</h2>
          <p>
            Alongside our crystal collections, discover spiritual
            services designed to support reflection, clarity and
            personal growth.
          </p>
        </div>

        <div className="home-services-content">
          <Services />
        </div>
      </section>

      <section className="home-section home-featured">
        <div className="home-section-heading">
          <span className="home-section-eyebrow">SELECTED WITH CARE</span>
          <h2>Customer Favourites</h2>
          <p>Discover special pieces from The Healing Star.</p>
        </div>

        <div className="home-featured-grid">
          {featuredProducts.map((product) => (
            <ProductCard
              key={`${product.category}-${product.id}`}
              productId={product.id}
              src={product.src}
              alt={product.alt}
              name={product.name}
              des={product.des}
              size={product.size}
              price={product.price}
              stock={product.stock}
              onClick={() =>
                navigate(`/products/${product.category}/${product.id}`)
              }
            />
          ))}
        </div>

        <div className="home-section-action">
          <button
            type="button"
            className="home-button home-button-primary"
            onClick={() => navigate("/shop/bracelets")}
          >
            Shop the Collection <ArrowRight size={17} />
          </button>
        </div>
      </section>

      <section className="home-story">
        <span className="home-section-eyebrow">THE HEALING STAR</span>
        <h2>Little rituals. Meaningful moments.</h2>
        <p>
          Whether you are exploring crystals or seeking spiritual
          guidance, find something that speaks to your journey.
        </p>
        <button
          type="button"
          className="home-button home-button-primary"
          onClick={() => navigate("/shop/bracelets")}
        >
          Discover Your Favourites <ArrowRight size={17} />
        </button>
      </section>

      <section className="home-testimonials">
        <div className="section-divider">
          <span className="home-section-eyebrow">KIND WORDS</span>
          <h2>Hear From Our Clients</h2>
          <p>Stories and experiences from our community.</p>
        </div>

        <Testimonial />
      </section>

      <Footer />
    </div>
  );
};

export default Home;
