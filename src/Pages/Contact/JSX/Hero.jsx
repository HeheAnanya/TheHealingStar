import React from "react";
import { Mail, MessageCircle, Sparkles, ArrowUpRight } from "lucide-react";
import "../CSS/Contact.css";

const topics = [
  "Crystal jewellery & products",
  "Tarot, numerology & Reiki",
  "Orders, shipping & support",
  "Something else",
];

const Hero = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <main className="contact-page">
      <section className="contact-hero" aria-labelledby="contact-title">
        <div className="contact-hero__copy">
          <span className="contact-eyebrow">We’re all ears</span>
          <h1 id="contact-title">Let’s start a <em>conversation.</em></h1>
          <p>
            Whether you’re curious about a product, exploring a wellness
            service or need a little help with an order, we’d love to hear
            from you.
          </p>
          <a className="contact-hero__link" href="#contact-form">
            Write to us <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="contact-hero__art" aria-hidden="true">
          <div className="contact-orbit contact-orbit--one" />
          <div className="contact-orbit contact-orbit--two" />
          <div className="contact-hero__sun">
            <Sparkles size={34} strokeWidth={1.2} />
            <span>A little<br />hello goes<br />a long way.</span>
          </div>
          <span className="contact-hero__spark contact-hero__spark--one">✧</span>
          <span className="contact-hero__spark contact-hero__spark--two">✳</span>
        </div>
      </section>

      <section className="contact-intro" aria-label="How we can help">
        <p>PRODUCT QUESTIONS</p>
        <span>·</span>
        <p>WELLNESS SERVICES</p>
        <span>·</span>
        <p>ORDER SUPPORT</p>
        <span>·</span>
        <p>JUST SAY HELLO</p>
      </section>

      <section className="contact-content" id="contact-form">
        <div className="contact-content__aside">
          <span className="contact-eyebrow">Get in touch</span>
          <h2>Tell us what’s<br /><em>on your mind.</em></h2>
          <p>
            Every message matters. Share a little about what you’re looking
            for and we’ll be happy to help you find the right direction.
          </p>
          <div className="contact-note">
            <span className="contact-note__icon"><MessageCircle size={19} /></span>
            <div>
              <strong>Not sure where to begin?</strong>
              <p>That’s perfectly okay. Choose “Something else” and tell us in your own words.</p>
            </div>
          </div>
        </div>

        <div className="contact-form-card">
          <form onSubmit={handleSubmit}>
            <div className="contact-form-card__heading">
              <span>YOUR NOTE TO US</span>
              <Mail size={20} strokeWidth={1.5} />
            </div>
            <div className="contact-field-row">
              <label>
                Your name
                <input type="text" name="name" placeholder="What should we call you?" autoComplete="name" required />
              </label>
              <label>
                Email address
                <input type="email" name="email" placeholder="you@example.com" autoComplete="email" required />
              </label>
            </div>
            <label>
              What can we help you with?
              <select name="topic" defaultValue="" required>
                <option value="" disabled>Select a topic</option>
                {topics.map((topic) => <option value={topic} key={topic}>{topic}</option>)}
              </select>
            </label>
            <label>
              Your message
              <textarea name="message" rows="5" placeholder="Write your message here..." required />
            </label>
            <button type="submit" disabled>
              Message form coming soon <ArrowUpRight size={17} />
            </button>
            <p className="contact-form-card__hint">
              Our online message form is being set up. The fields are a preview and aren’t submitted yet.
            </p>
          </form>
        </div>
      </section>

      <section className="contact-closing">
        <span className="contact-eyebrow">The Healing Star</span>
        <h2>A little more connection.<br /><em>A little more clarity.</em></h2>
        <p>Thank you for being here. We look forward to connecting with you.</p>
      </section>
    </main>
  );
};

export default Hero;
