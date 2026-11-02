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
    text: "TAROT CARD READING",
    subtitle: "Find clarity in the cards",
    items: ["Love & Relationships", "Career Guidance", "Spiritual Growth"],
    navi: "tarot",
  },
  {
    id: "2",
    src: Numerology,
    text: "NUMEROLOGY",
    subtitle: "Discover the meaning of your numbers",
    items: ["Life Path Number", "Destiny Number", "Personal Year"],
    navi: "numerology",
  },
  {
    id: "3",
    src: Reiki,
    text: "REIKI HEALING",
    subtitle: "Reconnect with a sense of balance",
    items: ["Energy Healing", "Stress Relief", "Chakra Balancing"],
    navi: "reiki",
  },
  {
    id: "4",
    src: Crystal,
    text: "CRYSTAL COLLECTION",
    subtitle: "Find meaningful pieces for your rituals",
    items: ["Crystal Bracelets", "Tumbled Stones", "Raw & Healing Crystals"],
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
  </section>
);

export default Hero;
