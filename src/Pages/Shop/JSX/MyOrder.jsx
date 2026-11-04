import React, { useEffect, useMemo, useState } from "react";
import { Package, CalendarDays, ArrowRight, RotateCcw, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Home/JSX/Navbar";
import Footer from "../../Home/JSX/Footer";
import { api } from "../../../api/axios";
import "../CSS/MyOrder.css";

const filters = ["All Orders", "Processing", "Shipped", "Delivered", "Cancelled"];
const normalize = (value) => String(value || "").toLowerCase().replaceAll("_", " ");

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All Orders");
  const navigate = useNavigate();

  async function fetchOrders() {
    try {
      const res = await api.get("/order/my");
      setOrders(res.data.found || []);
    } catch (err) {
      console.error("Unable to load orders:", err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteOrder(orderId) {
    if (!window.confirm("Are you sure you want to remove this order from your list?")) return;
    try {
      await api.delete(`/order/${orderId}`);
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (err) {
      console.error("Unable to remove order:", err);
    }
  }

  useEffect(() => { fetchOrders(); }, []);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "All Orders") return orders;
    return orders.filter(order => normalize(order.status) === normalize(activeFilter));
  }, [orders, activeFilter]);

  const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Date unavailable";

  return (
    <div className="shop-flow-page">
      <Navbar />
      <main className="my-orders-page">
        <header className="orders-heading">
          <span className="orders-eyebrow">YOUR HEALING STAR ACCOUNT</span>
          <h1>My Orders</h1>
          <p>Every order, thoughtfully kept in one place.</p>
        </header>

        <section className="orders-shell">
          <div className="orders-toolbar">
            <div className="orders-title"><Package size={23} /><h2>Order history</h2><span>{orders.length} total</span></div>
            <div className="orders-filters" role="tablist" aria-label="Filter orders">
              {filters.map(filter => (
                <button key={filter} role="tab" aria-selected={activeFilter === filter} className={activeFilter === filter ? "selected" : ""} onClick={() => setActiveFilter(filter)}>{filter}</button>
              ))}
            </div>
          </div>

          {loading ? <p className="orders-feedback">Gathering your orders…</p> : filteredOrders.length === 0 ? (
            <div className="orders-empty">
              <ShoppingBag size={42} />
              <h3>{orders.length ? "No orders in this category" : "Your journey starts here"}</h3>
              <p>{orders.length ? "Try another order status to see your purchases." : "When you place an order, its details and updates will appear here."}</p>
              {!orders.length && <button className="orders-primary-button" onClick={() => navigate("/shop/all")}>Explore the shop <ArrowRight size={16} /></button>}
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map(order => {
                const status = normalize(order.status);
                return (
                  <article className="order-card" key={order.id}>
                    <div className="order-card-top">
                      <div><span className="order-reference">ORDER #{String(order.id).padStart(5, "0")}</span><span className="order-date"><CalendarDays size={14} /> Placed on {formatDate(order.createdAt)}</span></div>
                      <div className="order-badges"><span className={`order-status-badge status-${status.replaceAll(" ", "-")}`}>{order.status || "Processing"}</span><span className="payment-status-badge">{normalize(order.payStatus) || "Payment pending"}</span></div>
                    </div>
                    <div className="order-card-body">
                      <div className="order-items-list">
                        {(order.items || []).map((item, index) => (
                          <div className="order-line-item" key={item.id || index}>
                            <div className="order-item-placeholder"><Package size={22} /></div>
                            <div className="order-item-name"><strong>{item.productName}</strong><span>Quantity: {item.quantity || 1}</span></div>
                          </div>
                        ))}
                      </div>
                      <div className="order-card-total"><span>Order total</span><strong>₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}</strong></div>
                      {(order.deliveryName || order.deliveryStreet) && (
                        <div className="order-delivery-snapshot">
                          <strong>Delivery address on this order</strong>
                          <span>{order.deliveryName}</span>
                          <span>{order.deliveryStreet}</span>
                          <span>{[order.deliveryCity, order.deliveryState, order.deliveryPincode].filter(Boolean).join(", ")}</span>
                          {order.deliveryPhone && <span>Phone: {order.deliveryPhone}</span>}
                        </div>
                      )}
                    </div>
                    <div className="order-card-footer">
                      <span className="order-footer-note">Thank you for choosing Healing Star.</span>
                      <div className="order-actions">
                        <button className="order-delete-button" onClick={() => deleteOrder(order.id)} aria-label="Remove order"><Trash2 size={15} /> Remove</button>
                        <button className="order-reorder-button" onClick={() => navigate("/shop/all")}><RotateCcw size={15} /> Shop again</button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MyOrder;
