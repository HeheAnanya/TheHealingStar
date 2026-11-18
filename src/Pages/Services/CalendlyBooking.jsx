import React from "react";
import "./CalendlyBooking.css";

/**
 * Reusable Calendly embed.
 * Pass the schedulingUrl returned by the backend for the selected package.
 * Keep payment verification on our backend before rendering this component.
 */
const CalendlyBooking = ({
  schedulingUrl,
  serviceName = "Your session",
  duration,
}) => {
  if (!schedulingUrl) {
    return (
      <section className="calendly-booking calendly-booking--empty">
        <h2>Appointment calendar coming soon</h2>
        <p>Available booking times will appear here once this service is configured.</p>
      </section>
    );
  }

  let safeUrl;
  try {
    safeUrl = new URL(schedulingUrl);
  } catch {
    return <p role="alert">This appointment link is not valid.</p>;
  }

  if (safeUrl.protocol !== "https:" || safeUrl.hostname !== "calendly.com") {
    return <p role="alert">This appointment link is not a trusted Calendly URL.</p>;
  }

  return (
    <section className="calendly-booking">
      <header className="calendly-booking__header">
        <p className="calendly-booking__eyebrow">THE HEALING STAR</p>
        <h2>Book your {serviceName} session</h2>
        {duration ? <p>{duration} minute session · India Standard Time</p> : null}
      </header>
      <iframe
        title={`Calendly booking for ${serviceName}`}
        src={safeUrl.toString()}
        className="calendly-booking__frame"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </section>
  );
};

export default CalendlyBooking;
