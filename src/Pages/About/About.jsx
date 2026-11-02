import React from "react";
import Navbar from "../Home/JSX/Navbar";
import Hero from "./JSX/Hero";
import Footer from "../Home/JSX/Footer";

const About = () => {
  return (
    <>
      <title>About The Healing Star | Our Story & Holistic Wellness</title>
      <meta
        name="description"
        content="Get to know The Healing Star — a mindful wellness space bringing together holistic experiences, thoughtful products and everyday inspiration for balance and personal growth."
      />
      <link rel="canonical" href="https://the-healing-star.vercel.app/about" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="The Healing Star" />
      <meta
        property="og:title"
        content="About The Healing Star | Our Story & Holistic Wellness"
      />
      <meta
        property="og:description"
        content="Discover the story, values and people behind The Healing Star."
      />
      <meta property="og:url" content="https://the-healing-star.vercel.app/about" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="About The Healing Star | Our Story & Holistic Wellness"
      />
      <meta
        name="twitter:description"
        content="Discover the story, values and people behind The Healing Star."
      />
      <Navbar />
      <Hero />
      <Footer />
    </>
  );
};

export default About;
