import React, { useCallback, useEffect, useState } from "react";
import { api } from "../../api/axios";
import AdminCalendlyEvents from "../Services/AdminCalendlyEvents";
import "./AdminOrders.css";

const formatDate = (value) => value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";
const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));

export default function AdminOrders() {
  const [tab, setTab] = useState("products");
  const [productOrders, setProductOrders] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serviceError, setServiceError] = useState("");

  const loadProductOrders = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await api.get("/admin/orders");
      setProductOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.Error || err.response?.data?.message || "Unable to load product orders. Please sign in as an admin.");
    } finally { setLoading(false); }
  }, []);

  const loadServiceBookings = useCallback(async () => {
    setLoading(true); setServiceError("");
    try {
      const response = await api.get("/admin/service-bookings");
      setServiceBookings(Array.isArray(response.data) ? response.data : response.data?.bookings || []);
    } catch (err) {
      setServiceError(err.response?.status === 404
        ? "Service booking records will appear here once the service-order API and database migration are enabled."
        : err.response?.data?.message || "Unable to load service bookings. Please try again.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadProductOrders(); }, [loadProductOrders]);
  useEffect(() => { if (tab === "services") loadServiceBookings(); }, [tab, loadServiceBookings]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      await loadProductOrders();
    } catch (err) {
      setError(err.response?.data?.Error || "Could not update this order status.");
    }
  };

  return (
    <main className="admin-orders-page">
      <header className="admin-orders-header">
        <div>
          <p className="admin-orders-eyebrow">THE HEALING STAR · ADMIN</p>
          <h1>Orders & Bookings</h1>
          <p>Manage product deliveries and healing session appointments from one place.</p>
        </div>
        <button className="admin-orders-refresh" onClick={tab === "products" ? loadProductOrders : loadServiceBookings} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      <nav className="admin-orders-tabs" aria-label="Order categories">
        <button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}>Product Orders <span>{productOrders.length}</span></button>
        <button className={tab === "services" ? "active" : ""} onClick={() => setTab("services")}>Service Bookings <span>{serviceBookings.length}</span></button>
      </nav>

      {tab === "products" ? (
        <section className="admin-orders-panel">
          {error && <p className="admin-orders-alert" role="alert">{error}</p>}
          {loading ? <p className="admin-orders-muted">Loading product orders…</p> : productOrders.length === 0 && !error ? <div className="admin-orders-empty"><h2>No product orders yet</h2><p>New customer purchases will show here.</p></div> : (
            <div className="admin-orders-list">
              {productOrders.map(order => (
                <article className="admin-order-card" key={order.id}>
                  <div className="admin-order-top">
                    <div><span className="admin-order-id">ORDER #{order.id}</span><h2>{order.user?.name || "Customer"}</h2><p>{order.user?.email || "—"} · {formatDate(order.createdAt)}</p></div>
                    <strong>{money(order.totalPrice)}</strong>
                  </div>
                  <div className="admin-order-items">{(order.items || []).map(item => <span key={item.id}>{item.productName} × {item.quantity}</span>)}</div>
                  <div className="admin-order-bottom">
                    <span className={`admin-order-payment ${order.payStatus === "SUCCESS" ? "paid" : "unpaid"}`}>Payment: {order.payStatus || "—"}</span>
                    <label>Delivery status
                      <select value={order.status || "ON_THE_WAY"} onChange={event => updateOrderStatus(order.id, event.target.value)}>
                        <option value="ON_THE_WAY">On the way</option><option value="DELIVERED">Delivered</option><option value="CANCELLED">Cancelled</option>
                      </select>
                    </label>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="admin-orders-panel">
          {serviceError && <p className="admin-orders-alert">{serviceError}</p>}
          {loading ? <p className="admin-orders-muted">Loading service bookings…</p> : serviceBookings.length === 0 && !serviceError ? <div className="admin-orders-empty"><h2>No service bookings yet</h2><p>Paid Tarot, Reiki and Numerology appointments will appear here.</p></div> : (
            <div className="admin-orders-list">
              {serviceBookings.map(booking => (
                <article className="admin-order-card" key={booking.id}>
                  <div className="admin-order-top"><div><span className="admin-order-id">BOOKING #{booking.id}</span><h2>{booking.user?.name || booking.customerName || "Customer"}</h2><p>{booking.user?.email || booking.customerEmail || "—"}</p></div><strong>{money(booking.amount)}</strong></div>
                  <div className="admin-order-items"><span>{booking.package?.name || booking.serviceName || "Healing session"}</span><span>{booking.durationMinutes || booking.package?.durationMinutes || "—"} minutes</span><span>{formatDate(booking.appointment?.scheduledAt || booking.scheduledAt)}</span></div>
                  <div className="admin-order-bottom"><span className="admin-order-payment paid">Payment: {booking.payStatus || "SUCCESS"}</span><span className="admin-order-status">{booking.appointment?.status || booking.status || "PENDING"}</span></div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
      <AdminCalendlyEvents />
    </main>
  );
}
