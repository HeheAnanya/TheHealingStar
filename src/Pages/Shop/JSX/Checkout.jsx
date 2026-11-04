import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight, ArrowLeft, ShieldCheck, PackageCheck } from "lucide-react";
import Navbar from "../../Home/JSX/Navbar";
import Footer from "../../Home/JSX/Footer";
import { api } from "../../../api/axios";
import "../CSS/Checkout.css";

const steps = ["Cart", "Checkout", "Payment", "Order Confirmed"];

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", state: "", pincode: "" });

  useEffect(() => {
    api.get("/cart").then(res => setCart(res.data)).catch(() => setCart({ items: [] }));
    api.get("/address").then(res => {
      setAddress(res.data);
      setForm({ name: res.data.name || "", phone: res.data.phone || "", address: res.data.address || "", city: res.data.city || "", state: res.data.state || "", pincode: res.data.pincode || "" });
    }).catch(() => setShowForm(true));
  }, []);

  const total = useMemo(() => (cart?.items || []).reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0), [cart]);
  const change = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  async function saveAddress(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post("/address", form);
      setAddress(res.data);
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to save address. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePayment() {
    if (!address) {
      setShowForm(true);
      return;
    }
    if (!cart?.items?.length) {
      alert("Your cart is empty.");
      navigate("/cart");
      return;
    }
    setPaying(true);
    try {
      const orderRes = await api.post("/order/create");
      const { orderId } = orderRes.data;
      const paymentRes = await api.post("/payment/create", { orderId });
      const razorpayOrder = paymentRes.data;
      if (!window.Razorpay) throw new Error("Payment gateway did not load. Please refresh and try again.");
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Healing Star",
        description: "Your Healing Star order",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            await api.post("/payment/verify", {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              raxorpay_sig: response.razorpay_signature,
              orderId
            });
            navigate("/order/my");
          } catch (err) {
            alert(err.response?.data?.message || "Payment verification failed. Please contact support before retrying.");
          } finally {
            setPaying(false);
          }
        },
        prefill: { name: address.name || "", contact: address.phone || "" },
        theme: { color: "#79502f" },
        modal: { ondismiss: () => setPaying(false) }
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Checkout failed.");
      setPaying(false);
    }
  }

  return (
    <div className="shop-flow-page">
      <Navbar />
      <main className="checkout-page">
        <div className="shop-stepper" aria-label="Checkout progress">
          {steps.map((step, index) => (
            <div className={`shop-step ${index <= 1 ? "active" : ""}`} key={step}>
              <span className="shop-step-number">{index === 0 ? "✓" : index + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <section className="checkout-address-panel">
            <div className="checkout-section-heading"><MapPin size={22} /><div><h1>Delivery Address</h1><p>Where should we send your order?</p></div></div>
            {address && !showForm && (
              <div className="saved-address">
                <span className="address-tag">SAVED ADDRESS</span>
                <h3>{address.name}</h3>
                <p>{address.address}</p>
                <p>{address.city}, {address.state} — {address.pincode}</p>
                <p>+91 {address.phone}</p>
                <button className="outline-gold-button" onClick={() => setShowForm(true)}>Change address</button>
              </div>
            )}
            {(!address || showForm) && (
              <form className="address-form" onSubmit={saveAddress}>
                <div className="checkout-form-grid">
                  <label>Full name <span>*</span><input name="name" value={form.name} onChange={change} placeholder="Enter your full name" required /></label>
                  <label>Phone number <span>*</span><input name="phone" value={form.phone} onChange={change} placeholder="10-digit mobile number" inputMode="tel" required /></label>
                  <label className="full-field">Address <span>*</span><input name="address" value={form.address} onChange={change} placeholder="House no., street, area" required /></label>
                  <label>City <span>*</span><input name="city" value={form.city} onChange={change} placeholder="City" required /></label>
                  <label>State <span>*</span><input name="state" value={form.state} onChange={change} placeholder="State" required /></label>
                  <label>PIN code <span>*</span><input name="pincode" value={form.pincode} onChange={change} placeholder="6-digit PIN" inputMode="numeric" pattern="[0-9]{6}" required /></label>
                </div>
                <div className="checkout-form-actions">
                  <button type="submit" className="gold-button address-save" disabled={saving}>{saving ? "Saving…" : "Save delivery address"}</button>
                  {address && <button type="button" className="text-link" onClick={() => setShowForm(false)}>Cancel</button>}
                </div>
              </form>
            )}
            <div className="checkout-assurance"><ShieldCheck size={17} /><span>Your address and order details are handled securely.</span></div>
          </section>

          <aside className="checkout-summary-panel">
            <h2>Your Order</h2>
            {!cart ? <p className="checkout-muted">Loading items…</p> : cart.items.length === 0 ? <p className="checkout-muted">Your cart is empty.</p> : cart.items.map(item => (
              <div className="checkout-summary-item" key={item.id}>
                <div><strong>{item.product.productName}</strong><span>Qty: {item.quantity}</span></div>
                <strong>₹{(Number(item.product.price) * item.quantity).toLocaleString("en-IN")}</strong>
              </div>
            ))}
            <div className="checkout-summary-divider" />
            <div className="checkout-price-row"><span>Subtotal</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
            <div className="checkout-price-row"><span>Shipping</span><strong>Calculated at checkout</strong></div>
            <div className="checkout-summary-divider" />
            <div className="checkout-grand-total"><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
            <button className="gold-button payment-cta" onClick={handlePayment} disabled={paying || !cart?.items?.length}>{paying ? "Opening payment…" : "Continue to Payment"} <ArrowRight size={17} /></button>
            <p className="checkout-secure"><PackageCheck size={16} /> Review your details before payment</p>
            <button className="checkout-back-link" onClick={() => navigate("/cart")}><ArrowLeft size={15} /> Back to cart</button>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
