import React, { useEffect } from "react";
import Navbar from "../Home/JSX/Navbar";
import Hero from "./JSX/Hero";
import Footer from "../Home/JSX/Footer";

const Contact = () => {
  useEffect(() => {
    const title = "Contact The Healing Star | Get in Touch";
    const description =
      "Contact The Healing Star for crystal jewellery, tarot, numerology, Reiki and order support.";
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
