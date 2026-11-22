import React, { useCallback, useEffect, useState } from "react";
import { api } from "../../api/axios";
import "./AdminServicePackages.css";

const emptyForm = {
  id: null, name: "", category: "TAROT", description: "",
  price: "", durationMinutes: "", calendlyEventTypeUri: "", schedulingUrl: "",
};

const AdminServicePackages = () => {
  const [packages, setPackages] = useState([]);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [packageResponse, eventResponse] = await Promise.all([
        api.get("/admin/service-packages"),
        api.get("/admin/calendly/event-types"),
      ]);
      setPackages(Array.isArray(packageResponse.data) ? packageResponse.data : []);
      setEvents(eventResponse.data.eventTypes || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load packages. Check admin login and Calendly connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const changeEvent = (uri) => {
    const event = events.find((item) => item.uri === uri);
    setForm((current) => ({
      ...current,
      calendlyEventTypeUri: uri,
      schedulingUrl: event?.schedulingUrl || current.schedulingUrl,
      durationMinutes: event?.duration || current.durationMinutes,
      name: current.name || event?.name || "",
    }));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        name: form.name,
        category: form.category,
        description: form.description,
        price: Number(form.price),
        durationMinutes: Number(form.durationMinutes),
        calendlyEventTypeUri: form.calendlyEventTypeUri,
        schedulingUrl: form.schedulingUrl,
      };
      if (form.id) await api.put(`/admin/service-packages/${form.id}`, payload);
      else await api.post("/admin/service-packages", payload);
      setForm(emptyForm);
      setMessage("Service package saved.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save this package.");
    } finally {
      setSaving(false);
    }
  };

  const edit = (item) => {
    setForm({
      id: item.id, name: item.name, category: item.category,
      description: item.description || "", price: String(item.price),
      durationMinutes: String(item.durationMinutes),
      calendlyEventTypeUri: item.calendlyEventTypeUri || "",
      schedulingUrl: item.schedulingUrl || "",
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggle = async (item) => {
    try {
      await api.patch(`/admin/service-packages/${item.id}/active`, { isActive: !item.isActive });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not change package availability.");
    }
  };

  return (
    <section className="admin-service-packages">
      <div className="admin-service-packages__heading">
        <div><p>BOOKABLE SERVICES</p><h2>Service Packages</h2><span>Set the price, duration and matching Calendly Event Type for each option.</span></div>
        <button type="button" onClick={load} disabled={loading}>Refresh</button>
      </div>

      {error && <div className="asp-alert asp-alert--error" role="alert">{error}</div>}
      {message && <div className="asp-alert" role="status">{message}</div>}

      <form className="asp-form" onSubmit={save}>
        <h3>{form.id ? `Edit package #${form.id}` : "Add a service package"}</h3>
        <div className="asp-fields">
          <label>Package name<input required maxLength="120" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Tarot Reading – 10 minutes" /></label>
          <label>Service category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}><option value="TAROT">Tarot</option><option value="REIKI">Reiki</option><option value="NUMEROLOGY">Numerology</option></select></label>
          <label>Price (INR)<input required min="1" type="number" step="1" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></label>
          <label>Duration (minutes)<input required min="1" type="number" step="1" value={form.durationMinutes} onChange={e => setForm({ ...form, durationMinutes: e.target.value })} /></label>
          <label className="asp-wide">Calendly Event Type<select value={form.calendlyEventTypeUri} onChange={e => changeEvent(e.target.value)}><option value="">Select a Calendly event</option>{events.filter(item => item.active).map(item => <option key={item.uri} value={item.uri}>{item.name} · {item.duration} min</option>)}</select></label>
          <label className="asp-wide">Calendly scheduling URL<input required type="url" value={form.schedulingUrl} onChange={e => setForm({ ...form, schedulingUrl: e.target.value })} placeholder="https://calendly.com/..." /></label>
          <label className="asp-wide">Description<textarea rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
        </div>
        <div className="asp-actions"><button type="submit" disabled={saving}>{saving ? "Saving..." : form.id ? "Update package" : "Add package"}</button><button type="button" className="asp-secondary" onClick={() => setForm(emptyForm)}>Clear form</button></div>
      </form>

      <div className="asp-list-heading"><h3>Configured packages</h3><span>{packages.length} total</span></div>
      {loading ? <p>Loading packages…</p> : packages.length === 0 ? <p>No service packages configured yet.</p> :
        <div className="asp-list">{packages.map(item => <article className="asp-card" key={item.id}>
          <div><span className="asp-category">{item.category}</span><h3>{item.name}</h3><p>{item.durationMinutes} minutes · ₹{item.price}</p><small>{item.calendlyEventTypeUri ? "Calendly event connected" : "Calendly event not connected"}</small></div>
          <div className="asp-card-actions"><span className={item.isActive ? "asp-active" : "asp-inactive"}>{item.isActive ? "Active" : "Inactive"}</span><button type="button" onClick={() => edit(item)}>Edit</button><button type="button" className="asp-secondary" onClick={() => toggle(item)}>{item.isActive ? "Deactivate" : "Activate"}</button></div>
        </article>)}</div>}
    </section>
  );
};

export default AdminServicePackages;
