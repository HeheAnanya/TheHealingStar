import React, { useEffect } from "react";
import Navbar from "../Home/JSX/Navbar";
import Hero from "./JSX/Hero";
import Footer from "../Home/JSX/Footer";

const About = () => {
  useEffect(() => {
    const title = "About The Healing Star | Our Story & Holistic Wellness";
    const description =
      "Get to know The Healing Star — a mindful wellness space bringing together holistic experiences, thoughtful products and everyday inspiration for balance and personal growth.";
    const canonicalUrl = "https://the-healing-star.vercel.app/about";

    document.title = title;

    const setMeta = (selector, attribute, value, createAttributes = {}) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        Object.entries(createAttributes).forEach(([key, attrValue]) =>
          element.setAttribute(key, attrValue)
        );
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    setMeta('meta[name="description"]', "content", description, { name: "description" });
    setMeta('meta[property="og:title"]', "content", title, { property: "og:title" });
    setMeta(
      'meta[property="og:description"]',
      "content",
      "Discover the story, values and people behind The Healing Star.",
      { property: "og:description" }
    );
    setMeta('meta[property="og:url"]', "content", canonicalUrl, { property: "og:url" });
    setMeta('meta[name="twitter:title"]', "content", title, { name: "twitter:title" });
    setMeta(
      'meta[name="twitter:description"]',
      "content",
      "Discover the story, values and people behind The Healing Star.",
      { name: "twitter:description" }
    );

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    return () => {
      document.title = "The Healing Star | Crystals, Tarot & Spiritual Wellness";
      document.head
        .querySelector('meta[name="description"]')
        ?.setAttribute(
          "content",
          "Explore crystal jewellery, meaningful gifts and spiritual wellness services at The Healing Star. Discover crystal bracelets, tarot readings, numerology and Reiki."
        );
      document.head
        .querySelector('link[rel="canonical"]')
        ?.setAttribute("href", "https://the-healing-star.vercel.app/");
      document.head
        .querySelector('meta[property="og:url"]')
        ?.setAttribute("content", "https://the-healing-star.vercel.app/");
      document.head
        .querySelector('meta[property="og:title"]')
        ?.setAttribute(
          "content",
          "The Healing Star | Crystals, Tarot & Spiritual Wellness"
        );
      document.head
        .querySelector('meta[name="twitter:title"]')
        ?.setAttribute(
          "content",
          "The Healing Star | Crystals, Tarot & Spiritual Wellness"
        );
    };
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <Footer />
    </>
  );
};

export default About;
