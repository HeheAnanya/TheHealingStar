import React from "react";
import TeamMember from "./TeamMember";
import "../CSS/About.css";

const teamMembers = [
  {
    id: "founder",
    name: "The Founder",
    role: "Founder & Wellness Guide",
    bio: "Bringing the vision of The Healing Star to life through a love for mindful living, holistic wellness and meaningful connections.",
    image: "/assets/founder.png",
  },
  {
    id: "website-handler",
    name: "The Digital Guide",
    role: "Website & Customer Experience",
    bio: "Helping you explore the world of The Healing Star online, with thoughtful guidance and a welcoming experience at every step.",
    initials: "DG",
  },
];

const values = [
  {
    number: "01",
    title: "Authenticity",
    description: "Thoughtful choices, honest guidance and a genuine approach to wellness.",
  },
  {
    number: "02",
    title: "Mindful Living",
    description: "Small, intentional practices that invite more balance into everyday life.",
  },
  {
    number: "03",
    title: "Care & Connection",
    description: "A welcoming space where every question and every journey matters.",
  },
  {
    number: "04",
    title: "Continuous Growth",
    description: "Making room to learn, evolve and discover what wellbeing means to you.",
  },
];

const Hero = () => {
  return (
    <main className="about-page">
      <section className="about-hero" aria-labelledby="about-page-title">
        <div className="about-hero__content">
          <span className="about-eyebrow">A little about us</span>
          <h1 id="about-page-title">A mindful journey, rooted in <em>wellbeing.</em></h1>
          <p>
            The Healing Star is a space for those seeking a little more balance,
            intention and meaning in everyday life. We bring together mindful
            products and holistic wellness experiences to support your personal
            journey, one thoughtful step at a time.
          </p>
          <a className="about-primary-link" href="#our-story">
            Discover our story <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="about-hero__image-wrap">
          <img
            src="/assets/about.jpeg"
            alt="A calm, thoughtfully arranged wellness space"
            fetchPriority="high"
          />
          <span className="about-hero__image-note">Find your moment of calm</span>
        </div>
      </section>

      <section className="about-essence" aria-label="What guides us">
        <div className="about-essence__item">
          <span className="about-essence__symbol" aria-hidden="true">✧</span>
          <span>Holistic wellbeing</span>
        </div>
        <div className="about-essence__item">
          <span className="about-essence__symbol" aria-hidden="true">❋</span>
          <span>Mindful choices</span>
        </div>
        <div className="about-essence__item">
          <span className="about-essence__symbol" aria-hidden="true">♡</span>
          <span>Care in every detail</span>
        </div>
        <div className="about-essence__item">
          <span className="about-essence__symbol" aria-hidden="true">☼</span>
          <span>Everyday growth</span>
        </div>
      </section>

      <section className="about-story" id="our-story" aria-labelledby="about-story-title">
        <div className="about-story__image">
          <img
            src="/assets/showroom.png"
            alt="The Healing Star's collection and wellness-inspired space"
            loading="lazy"
          />
        </div>
        <div className="about-story__content">
          <span className="about-eyebrow">Our story</span>
          <h2 id="about-story-title">Wellness is a journey, not a destination.</h2>
          <p>
            The Healing Star grew from a simple thought: feeling good should
            begin with feeling connected — to yourself, to your surroundings
            and to the little rituals that make a day meaningful.
          </p>
          <p>
            Today, we bring together carefully chosen pieces and holistic
            experiences designed to encourage reflection, self-care and
            personal growth. Whether you are just beginning or continuing a
            journey of your own, we are glad you are here.
          </p>
        </div>
      </section>

      <section className="about-values" aria-labelledby="about-values-title">
        <div className="about-section-heading">
          <span className="about-eyebrow">What matters to us</span>
          <h2 id="about-values-title">The values behind the journey</h2>
          <p>A few guiding principles shape the way we curate, create and connect.</p>
        </div>
        <div className="about-values__grid">
          {values.map((value) => (
            <article className="about-value" key={value.number}>
              <span className="about-value__number">{value.number}</span>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-team" aria-labelledby="about-team-title">
        <div className="about-section-heading">
          <span className="about-eyebrow">The people behind the screen</span>
          <h2 id="about-team-title">A small team, a shared intention.</h2>
          <p>
            Meet the people helping bring The Healing Star to you. As we grow,
            this space can grow with us.
          </p>
        </div>
        <div className="about-team__grid">
          {teamMembers.map((member) => (
            <TeamMember key={member.id} {...member} />
          ))}
        </div>
      </section>

      <section className="about-purpose">
        <span className="about-eyebrow">Our purpose</span>
        <h2>Making mindful living feel a little closer, every day.</h2>
        <p>
          We hope The Healing Star becomes a gentle part of your everyday
          rituals — a place to explore, learn and find what resonates with you.
        </p>
      </section>
    </main>
  );
};

export default Hero;
