import React, { useEffect, useState } from "react";
import { api } from "../../api/axios";
import "./AdminCalendlyEvents.css";

/**
 * Admin utility for checking the Calendly connection and reviewing Event Types.
 * Add this component inside the existing admin dashboard when ready.
 */
const AdminCalendlyEvents = () => {
  const [events, setEvents] = useState([]);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEventTypes = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/admin/calendly/event-types");
      setAccount(response.data.user);
      setEvents(response.data.eventTypes || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load Calendly Event Types. Check admin login and backend token."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventTypes();
  }, []);

  return (
    <section className="admin-calendly">
      <div className="admin-calendly__heading">
        <div>
          <p className="admin-calendly__eyebrow">INTEGRATIONS</p>
          <h2>Calendly Event Types</h2>
          {account ? (
            <p>Connected as {account.name} · {account.email}</p>
          ) : null}
        </div>
        <button type="button" onClick={loadEventTypes} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error ? <p className="admin-calendly__error" role="alert">{error}</p> : null}
      {loading ? <p>Loading Calendly events...</p> : null}

      {!loading && !error && events.length === 0 ? (
        <p>No active Event Types found in this Calendly account yet.</p>
      ) : null}

      <div className="admin-calendly__list">
        {events.map((event) => (
          <article className="admin-calendly__event" key={event.uri}>
            <div>
              <h3>{event.name}</h3>
              <p>{event.duration} minutes · {event.kind || "Event"}</p>
              <small>{event.active ? "Active" : "Inactive"}</small>
            </div>
            {event.schedulingUrl ? (
              <a href={event.schedulingUrl} target="_blank" rel="noreferrer">
                Open booking page
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminCalendlyEvents;
