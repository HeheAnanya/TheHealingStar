import React from "react";
import { Link } from "react-router-dom";
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
    text: "TAROT CARD READING",
    subtitle: "Find clarity in the cards",
    items: [
      "Love & Relationships",
      "Career Guidance",
      "Spiritual Growth",
      "Decision Making",
      "Future Insights",
    ],
    navi: "tarot",
  },
  {
    id: "2",
    src: Numerology,
    text: "NUMEROLOGY",
    subtitle: "Discover the meaning of your numbers",
    items: [
      "Mobile Number Compatibility",
      "Name Number Compatibility",
      "Marriage Matchmaking",
      "Life Path Reading",
      "Yearly Forecasts",
    ],
    navi: "numerology",
  },
  {
    id: "3",
    src: Reiki,
    text: "REIKI HEALING",
    subtitle: "Reconnect with a sense of balance",
    items: [
      "Energy Balancing",
      "Stress Reduction",
      "Emotional Release",
      "Mindful Relaxation",
      "Distance Reiki Sessions",
    ],
    navi: "reiki",
  },
  {
    id: "4",
    src: Crystal,
    text: "CRYSTAL COLLECTION",
    subtitle: "Find meaningful pieces for your rituals",
    items: [
      "Crystal Bracelets",
      "Pendants",
      "Crystal Spheres",
      "Salt Lamps",
      "Rings & Earrings",
      "Gemstone Trees",
      "Evil Eye",
    ],
    navi: "bracelets",
  },
];

const benefits = [
  {
    number: "01",
    title: "Thoughtfully Curated",
    description: "Explore services and collections selected with care for your personal journey.",
  },
  {
    number: "02",
    title: "A Personal Journey",
    description: "Find space for reflection, self-discovery and meaningful everyday rituals.",
  },
  {
    number: "03",
    title: "A Holistic Experience",
    description: "Bring together spiritual guidance, mindful practices and crystal treasures.",
  },
];

const Hero = () => (
  <>
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
          {work.map((item, index) => (
            <Work
              key={item.id}
              src={item.src}
              text={item.text}
              subtitle={item.subtitle}
              items={item.items}
              number={`0${index + 1}`}
              to={`/shop/${item.navi}`}
            />
          ))}
        </div>
      </div>

      <section className="services-benefits" aria-label="Why choose The Healing Star">
        {benefits.map((benefit) => (
          <article className="services-benefit" key={benefit.number}>
            <span className="services-benefit-number">{benefit.number}</span>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </article>
        ))}
      </section>
    </section>

    <section className="services-cta">
      <h2>A little more clarity. A little more balance.</h2>
      <p>Explore the service or collection that feels right for you.</p>
      <Link className="services-cta-link" to="/shop/bracelets">
        Explore our collections
      </Link>
    </section>
  </>
);

export default Hero;
