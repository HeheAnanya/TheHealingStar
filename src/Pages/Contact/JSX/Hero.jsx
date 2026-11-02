import React, { useState } from "react";
import { Mail, Phone, CheckCircle2, AlertCircle } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "../../../config/contact";
import "../CSS/Contact.css";

const Hero = () => {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Your message could not be sent. Please try again.");
      }

      form.reset();
      setStatus({
        type: "success",
        message: result.message || "Your message has been received.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again or contact us by phone or email.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="contact-page">
      <section className="contact-layout" aria-labelledby="contact-title">
        <div className="contact-image" role="img" aria-label="Warm, calm wellness studio interior" />
        <div className="contact-panel">
          <div className="contact-panel__inner">
            <span className="contact-eyebrow">WE’RE HERE TO HELP</span>
            <h1 id="contact-title">Contact Us</h1>

            <div className="contact-details">
              <a href={`tel:${CONTACT_PHONE}`} className="contact-detail">
                <Phone aria-hidden="true" size={23} />
                <span>{CONTACT_PHONE_DISPLAY}</span>
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="contact-detail">
                <Mail aria-hidden="true" size={24} />
                <span>{CONTACT_EMAIL}</span>
              </a>
            </div>

            <p className="contact-form-intro">Request an appointment or send us a message</p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="contact-name">Name</label>
              <input id="contact-name" name="name" type="text" placeholder="Name" autoComplete="name" maxLength="100" required />

              <label className="sr-only" htmlFor="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" placeholder="Email" autoComplete="email" maxLength="254" required />

              <label className="sr-only" htmlFor="contact-phone">Phone</label>
              <input id="contact-phone" name="phone" type="tel" placeholder="Phone (optional)" autoComplete="tel" maxLength="30" />

              <label className="sr-only" htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" placeholder="Message" rows="4" maxLength="3000" required />

              <input className="contact-honeypot" type="text" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" />

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "SENDING..." : "SUBMIT"}
              </button>
            </form>

            {status.message && (
              <p className={`contact-status contact-status--${status.type}`} role="status">
                {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {status.message}
              </p>
            )}
            <p className="contact-panel__note">Prefer email? Write to us anytime at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;
