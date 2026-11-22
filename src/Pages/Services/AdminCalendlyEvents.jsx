import React, { useEffect, useState } from "react";
import { api } from "../../api/axios";
import "./AdminCalendlyEvents.css";

const AdminCalendlyEvents = () => {
  const [events, setEvents] = useState([]);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [webhookBusy, setWebhookBusy] = useState(false);
  const [signingKey, setSigningKey] = useState("");
  const [webhookMessage, setWebhookMessage] = useState("");

  const loadEventTypes = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/admin/calendly/event-types");
      setAccount(response.data.user);
      setEvents(response.data.eventTypes || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load Calendly Event Types. Check admin login and backend token.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEventTypes(); }, []);

  const setupWebhook = async () => {
    setWebhookBusy(true);
    setError("");
    setWebhookMessage("");
    setSigningKey("");
    try {
      const response = await api.post("/admin/calendly/webhook");
      setSigningKey(response.data.signingKey || "");
      setWebhookMessage("Webhook created. Copy the signing key now and add it to the backend environment as CALENDLY_WEBHOOK_SIGNING_KEY.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create Calendly webhook.");
    } finally {
      setWebhookBusy(false);
    }
  };

  return (
    <section className="admin-calendly">
      <div className="admin-calendly__heading">
        <div>
          <p className="admin-calendly__eyebrow">INTEGRATIONS</p>
          <h2>Calendly Event Types</h2>
          {account ? <p>Connected as {account.name} · {account.email}</p> : null}
        </div>
        <div className="admin-calendly__actions">
          <button type="button" onClick={loadEventTypes} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</button>
          <button type="button" onClick={setupWebhook} disabled={webhookBusy}>{webhookBusy ? "Creating..." : "Connect booking webhook"}</button>
        </div>
      </div>

      {error ? <p className="admin-calendly__error" role="alert">{error}</p> : null}
      {webhookMessage ? <p className="admin-calendly__success" role="status">{webhookMessage}</p> : null}
      {signingKey ? <div className="admin-calendly__signing-key"><strong>Webhook signing key (shown once)</strong><code>{signingKey}</code></div> : null}
      {loading ? <p>Loading Calendly events...</p> : null}
      {!loading && !error && events.length === 0 ? <p>No active Event Types found in this Calendly account yet.</p> : null}

      <div className="admin-calendly__list">
        {events.map((event) => (
          <article className="admin-calendly__event" key={event.uri}>
            <div><h3>{event.name}</h3><p>{event.duration} minutes · {event.kind || "Event"}</p><small>{event.active ? "Active" : "Inactive"}</small></div>
            {event.schedulingUrl ? <a href={event.schedulingUrl} target="_blank" rel="noreferrer">Open booking page</a> : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminCalendlyEvents;
