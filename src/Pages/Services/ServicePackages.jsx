import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import "./ServicePackages.css";

const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(Number(value || 0));

const ServicePackages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    api.get("/services/packages")
      .then(response => setPackages(Array.isArray(response.data) ? response.data : []))
      .catch(err => setError(err.response?.data?.message || "Unable to load service packages right now."))
      .finally(() => setLoading(false));
  }, []);

  const loadRazorpay = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const book = async (item) => {
    setError("");
    setNotice("");
    setBusyId(item.id);
    try {
      const account = await api.get("/auth/me");
      const user = account.data.user;
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay checkout could not be loaded. Please check your internet connection.");

      const response = await api.post("/payment/service/create", { packageId: item.id });
      const { key, razorpayOrder, serviceOrderId } = response.data;
      const checkout = new window.Razorpay({
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "The Healing Star",
        description: item.name,
        order_id: razorpayOrder.id,
        prefill: { name: user.name, email: user.email },
        theme: { color: "#8a6b43" },
        modal: {
          ondismiss: () => setBusyId(null),
        },
        handler: async (paymentResult) => {
          try {
            const verified = await api.post("/payment/service/verify", {
              serviceOrderId,
              razorpay_order_id: paymentResult.razorpay_order_id,
              razorpay_payment_id: paymentResult.razorpay_payment_id,
              razorpay_signature: paymentResult.razorpay_signature,
            });
            const bookingUrl = new URL(verified.data.schedulingUrl);
            bookingUrl.searchParams.set("name", user.name);
            bookingUrl.searchParams.set("email", user.email);
            bookingUrl.searchParams.set("timezone", "Asia/Kolkata");
            window.location.assign(bookingUrl.toString());
          } catch (verificationError) {
            setError(verificationError.response?.data?.message || "Payment could not be verified. Please contact support before paying again.");
            setBusyId(null);
          }
        },
      });
      checkout.on("payment.failed", (failure) => {
        setError(failure.error?.description || "Payment failed. Please try again.");
        setBusyId(null);
      });
      checkout.open();
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login", { state: { from: "/services" } });
        return;
      }
      setError(err.response?.data?.message || err.message || "Unable to start payment.");
      setBusyId(null);
    }
  };

  const categories = [
    { key: "TAROT", title: "Tarot readings", intro: "Choose a reading length that suits the questions you want to explore." },
    { key: "REIKI", title: "Reiki healing", intro: "Choose the session duration for your personal healing appointment." },
    { key: "NUMEROLOGY", title: "Numerology", intro: "Choose a numerology consultation and explore your numbers." },
  ];

  return (
    <section className="service-packages" id="book-a-session">
      <div className="service-packages__intro"><span>BOOK YOUR SESSION</span><h2>Choose Your Healing Experience</h2><p>Select a service and duration. Complete secure payment first, then choose your appointment time on Calendly.</p></div>
      {error && <p className="service-packages__alert" role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      {loading ? <p className="service-packages__empty">Loading available sessions…</p> :
        packages.length === 0 ? <p className="service-packages__empty">Sessions will be available here soon.</p> :
        categories.map(category => {
          const entries = packages.filter(item => item.category === category.key);
          if (!entries.length) return null;
          return <div className="service-package-group" key={category.key}>
            <div className="service-package-group__heading"><h3>{category.title}</h3><p>{category.intro}</p></div>
            <div className="service-package-grid">{entries.map(item => <article className="service-package-card" key={item.id}>
              <span>{item.durationMinutes} MINUTES</span><h4>{item.name}</h4><p>{item.description || category.intro}</p>
              <div className="service-package-card__bottom"><strong>{money(item.price)}</strong><button type="button" disabled={busyId !== null} onClick={() => book(item)}>{busyId === item.id ? "Preparing payment…" : "Book & Pay"}</button></div>
            </article>)}</div>
          </div>;
        })}
      <p className="service-packages__timezone">Appointments are scheduled through Calendly. Select your preferred time and timezone on the booking page.</p>
    </section>
  );
};

export default ServicePackages;
