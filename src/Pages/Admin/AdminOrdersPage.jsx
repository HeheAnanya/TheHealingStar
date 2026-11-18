import React, { useCallback, useEffect, useState } from "react";
import { api } from "../../api/axios";
import AdminCalendlyEvents from "../Services/AdminCalendlyEvents";
import "./AdminOrdersPage.css";

const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(Number(value || 0));

const dateTime = (value) => value ? new Date(value).toLocaleString("en-IN", {
  dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata",
}) : "Not scheduled";

const AdminOrdersPage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (activeTab === "products") {
        const response = await api.get("/admin/orders");
        setOrders(Array.isArray(response.data) ? response.data : response.data.orders || []);
      } else if (activeTab === "services") {
        const response = await api.get("/admin/service-bookings");
        setBookings(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.Error ||
        "Could not load orders. Please check that you are logged in as an admin.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { loadData(); }, [loadData]);

  const updateProductStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.Error || "Could not update product order status.");
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await api.put(`/admin/service-bookings/${bookingId}/status`, { status });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update service booking status.");
    }
  };

  return (
    <main className="admin-orders-page">
      <div className="admin-orders-top">
        <div>
          <p className="admin-orders-eyebrow">THE HEALING STAR · ADMIN</p>
          <h1>Orders & Bookings</h1>
          <p className="admin-orders-subtitle">Manage product purchases and healing sessions from one place.</p>
        </div>
        <button className="admin-orders-refresh" onClick={loadData} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="admin-orders-tabs" role="tablist" aria-label="Order categories">
        <button role="tab" aria-selected={activeTab === "products"}
          className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>
          Product Orders <span>{orders.length}</span>
        </button>
        <button role="tab" aria-selected={activeTab === "services"}
          className={activeTab === "services" ? "active" : ""} onClick={() => setActiveTab("services")}>
          Service Bookings <span>{bookings.length}</span>
        </button>
        <button role="tab" aria-selected={activeTab === "calendly"}
          className={activeTab === "calendly" ? "active" : ""} onClick={() => setActiveTab("calendly")}>
          Calendly Settings
        </button>
      </div>

      {error ? <div className="admin-orders-error" role="alert">{error}</div> : null}
      {loading ? <div className="admin-orders-empty">Loading {activeTab === "products" ? "product orders" : "bookings"}...</div> : null}

      {!loading && activeTab === "products" && (
        <section className="admin-orders-panel">
          <div className="admin-orders-panel-heading"><h2>Product Orders</h2><span>{orders.length} total</span></div>
          {orders.length === 0 ? <p className="admin-orders-empty">No product orders found.</p> :
            <div className="admin-orders-table-wrap"><table className="admin-orders-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Amount</th><th>Payment</th><th>Placed on</th><th>Delivery status</th></tr></thead>
              <tbody>{orders.map(order => <tr key={order.id}>
                <td>#{order.id}</td>
                <td><strong>{order.user?.name || "Customer"}</strong><small>{order.user?.email || "—"}</small></td>
                <td>{(order.items || []).map(item => <div key={item.id}>{item.productName} × {item.quantity}</div>)}</td>
                <td>{money(order.totalPrice)}</td>
                <td><span className={`admin-orders-status ${String(order.payStatus).toLowerCase()}`}>{order.payStatus || "—"}</span></td>
                <td>{dateTime(order.createdAt)}</td>
                <td><select value={order.status || "ON_THE_WAY"} onChange={e => updateProductStatus(order.id, e.target.value)}>
                  <option value="ON_THE_WAY">On the way</option><option value="DELIVERED">Delivered</option><option value="CANCELLED">Cancelled</option>
                </select></td>
              </tr>)}</tbody>
            </table></div>}
        </section>
      )}

      {!loading && activeTab === "services" && (
        <section className="admin-orders-panel">
          <div className="admin-orders-panel-heading"><h2>Service Bookings</h2><span>{bookings.length} total</span></div>
          {bookings.length === 0 ? <p className="admin-orders-empty">No service bookings yet. Confirmed appointments will appear here.</p> :
            <div className="admin-bookings-grid">{bookings.map(booking => (
              <article className="admin-booking-card" key={booking.id}>
                <div className="admin-booking-card-head"><span>BOOKING #{booking.id}</span><span className={`admin-orders-status ${String(booking.status).toLowerCase()}`}>{booking.status}</span></div>
                <h3>{booking.serviceOrder?.package?.name || booking.serviceName || booking.orderItem?.productName || "Healing session"}</h3>
                <p className="admin-booking-customer">{booking.user?.name || "Customer"} · {booking.user?.email || "—"}</p>
                <div className="admin-booking-details">
                  <div><small>Appointment time</small><strong>{dateTime(booking.scheduledAt || booking.slot?.startsAt)}</strong></div>
                  <div><small>Payment</small><strong>{booking.serviceOrder?.payStatus || booking.orderItem?.order?.payStatus || "Payment record unavailable"}</strong></div>
                  <div><small>Booked on</small><strong>{dateTime(booking.bookedAt)}</strong></div>
                </div>
                <label className="admin-booking-status-label">Update booking status
                  <select value={booking.status || "BOOKED"} onChange={e => updateBookingStatus(booking.id, e.target.value)}>
                    <option value="BOOKED">Booked</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option>
                  </select>
                </label>
              </article>
            ))}</div>}
        </section>
      )}

      {activeTab === "calendly" && <AdminCalendlyEvents />}
    </main>
  );
};

export default AdminOrdersPage;
