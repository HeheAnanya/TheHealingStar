import React, { useEffect } from "react";
import Navbar from "../Home/JSX/Navbar";
import Hero from "./JSX/Hero";
import Footer from "../Home/JSX/Footer";

const Contact = () => {
  useEffect(() => {
    const title = "Contact The Healing Star | We're Here to Help";
    const description =
      "Have a question about crystal jewellery, tarot, numerology or Reiki? Get in touch with The Healing Star. We'd love to hear from you.";
    const canonicalUrl = "https://the-healing-star.vercel.app/contact";

    document.title = title;

    const setMeta = (selector, attribute, value, attrs = {}) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        Object.entries(attrs).forEach(([key, attrValue]) =>
          element.setAttribute(key, attrValue)
        );
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    setMeta('meta[name="description"]', "content", description, { name: "description" });
    setMeta('meta[property="og:title"]', "content", title, { property: "og:title" });
    setMeta('meta[property="og:description"]', "content", description, { property: "og:description" });
    setMeta('meta[property="og:url"]', "content", canonicalUrl, { property: "og:url" });
    setMeta('meta[name="twitter:title"]', "content", title, { name: "twitter:title" });
    setMeta('meta[name="twitter:description"]', "content", description, { name: "twitter:description" });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    return () => {
      document.title = "The Healing Star | Crystals, Tarot & Spiritual Wellness";
      document.head.querySelector('meta[name="description"]')?.setAttribute(
        "content",
        "Explore crystal jewellery, meaningful gifts and spiritual wellness services at The Healing Star."
      );
      document.head.querySelector('link[rel="canonical"]')?.setAttribute(
        "href",
        "https://the-healing-star.vercel.app/"
      );
      document.head.querySelector('meta[property="og:url"]')?.setAttribute(
        "content",
        "https://the-healing-star.vercel.app/"
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

export default Contact;
