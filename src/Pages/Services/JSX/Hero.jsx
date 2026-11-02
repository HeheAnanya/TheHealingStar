import React from "react";
import Work from "./Work";
import "../CSS/Hero.css";
import "../CSS/Work.css";

import Tarot from "../../../../public/assets/tarrot.png";
import Numerology from "../../../../public/assets/numerlogy.png";
import Reiki from "../../../../public/assets/reiki.png";
import Crystal from "../../../../public/assets/crystal.png";


const work = [
  {
    id: "1",
    src: Tarot,
    text: "Tarot Card Reading",
    description:
      "Discover clarity and meaningful insights through tarot readings. Explore guidance for relationships, career choices and your personal journey.",
    items: [
      "Love & Relationships",
      "Career Guidance",
      "Life Guidance",
    ],
    navi: "tarot",
  },
  {
    id: "2",
    src: Numerology,
    text: "Numerology",
    description:
      "Explore the significance of numbers in your life. Understand your personal numbers and discover insights into your life path and future.",
    items: [
      "Life Path Number",
      "Destiny Number",
      "Personal Year",
    ],
    navi: "numerology",
  },
  {
    id: "3",
    src: Reiki,
    text: "Reiki Healing",
    description:
      "Experience a mindful healing practice focused on relaxation, balance and emotional well-being through Reiki energy sessions.",
    items: [
      "Energy Healing",
      "Stress Relief",
      "Chakra Balancing",
    ],
    navi: "reiki",
  },
  {
    id: "4",
    src: Crystal,
    text: "Crystal Collection",
    description:
      "Explore thoughtfully selected crystals and crystal jewellery. Find meaningful pieces for your collection, rituals and everyday life.",
    items: [
      "Crystal Bracelets",
      "Tumbled Stones",
      "Healing Crystals",
    ],
    navi: "bracelets",
  },
];

const Hero = () => (
  <section className="main" id="services">
    <div className="tagline">
      <span className="services-heading1">THE HEALING STAR EXPERIENCE</span>
      <h1 className="services-heading2">
        Discover Your Path to
        <span> Balance &amp; Well-being</span>
      </h1>
      <p className="services-intro">
        From spiritual guidance to meaningful crystals, explore experiences
        thoughtfully chosen for your personal journey.
      </p>
    </div>


<div className="container">
  <div className="service-card">
    {work.map((item) => (
      <Work
        key={item.id}
        src={item.src}
        text={item.text}
        description={item.description}
        items={item.items}
        to={`/shop/${item.navi}`}
      />
    ))}
  </div>
</div>
  </section>
);

export default Hero;
