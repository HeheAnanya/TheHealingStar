import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { api } from "../../api/axios";
import "./ServicePackages.css";

const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(Number(value || 0));

const getPrice = (value) => Number(value || 0);
const getDuration = (value) => Number(value || 0);

const ServicePackages = ({ categoryFilter = null, categoryTitle = "Healing sessions", categoryImage }) => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    api.get("/services/packages")
      .then(response => setPackages(Array.isArray(response.data) ? response.data : []))
      .catch(err => setError(err.response?.data?.message || "Unable to load service packages right now."))
      .finally(() => setLoading(false));
  }, []);

  const categoryPackages = useMemo(
    () => packages.filter(item => !categoryFilter || item.category === categoryFilter),
    [packages, categoryFilter]
  );
  const maxAvailablePrice = useMemo(
    () => Math.max(0, ...categoryPackages.map(item => getPrice(item.price))),
    [categoryPackages]
  );
  const durations = useMemo(
    () => [...new Set(categoryPackages.map(item => getDuration(item.durationMinutes)).filter(Boolean))].sort((a,b) => a-b),
    [categoryPackages]
  );

  useEffect(() => {
    setMaxPrice(maxAvailablePrice);
  }, [maxAvailablePrice]);

  const filteredPackages = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = categoryPackages.filter(item => {
      const searchable = `${item.name || ""} ${item.description || ""} ${item.durationMinutes || ""} minutes`.toLowerCase();
      return (!query || searchable.includes(query)) &&
        getPrice(item.price) <= maxPrice &&
        (!selectedDurations.length || selectedDurations.includes(getDuration(item.durationMinutes)));
    });
    if (sortBy === "priceLow") result.sort((a,b) => getPrice(a.price)-getPrice(b.price));
    if (sortBy === "priceHigh") result.sort((a,b) => getPrice(b.price)-getPrice(a.price));
    if (sortBy === "duration") result.sort((a,b) => getDuration(a.durationMinutes)-getDuration(b.durationMinutes));
    if (sortBy === "name") result.sort((a,b) => (a.name || "").localeCompare(b.name || ""));
    return result;
  }, [categoryPackages, search, maxPrice, selectedDurations, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setMaxPrice(maxAvailablePrice);
    setSelectedDurations([]);
    setSortBy("featured");
  };

  const toggleDuration = (duration) => setSelectedDurations(previous =>
    previous.includes(duration) ? previous.filter(item => item !== duration) : [...previous, duration]
  );

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
        modal: { ondismiss: () => setBusyId(null) },
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
      checkout.on("payment.failed", failure => {
        setError(failure.error?.description || "Payment failed. Please try again.");
        setBusyId(null);
      });
      checkout.open();
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login", { state: { from: window.location.pathname } });
        return;
      }
      setError(err.response?.data?.message || err.message || "Unable to start payment.");
      setBusyId(null);
    }
  };

  return (
    <main className="service-packages-page">
      <section className="service-packages-banner">
        {categoryImage && <img src={categoryImage} alt="" className="service-packages-banner__image" />}
        <div className="service-packages-banner__content">
          <span>THE HEALING STAR EXPERIENCE</span>
          <h1>{categoryTitle}</h1>
          <p>Choose a session that fits your journey, then book your preferred appointment time.</p>
        </div>
      </section>

      <section className="service-packages-shopping">
        <div className="service-packages-toolbar">
          <form className="service-packages-search" role="search" onSubmit={event => event.preventDefault()}>
            <Search size={19} aria-hidden="true" />
            <input type="search" aria-label="Search service packages" placeholder={`Search ${categoryTitle.toLowerCase()} sessions...`} value={search} onChange={event => setSearch(event.target.value)} />
            {search && <button type="button" aria-label="Clear search" onClick={() => setSearch("")}><X size={17}/></button>}
          </form>
          <button type="button" className="service-packages-mobile-filter" onClick={() => setMobileFiltersOpen(open => !open)} aria-expanded={mobileFiltersOpen}>
            <SlidersHorizontal size={17}/> Filters
          </button>
        </div>

        <div className="service-packages-breadcrumb"><button type="button" onClick={() => navigate("/")}>Home</button><span>/</span><button type="button" onClick={() => navigate("/services")}>Services</button><span>/</span><span>{categoryTitle}</span></div>

        {error && <p className="service-packages-alert" role="alert">{error}</p>}
        {loading ? <p className="service-packages-empty">Loading available sessions…</p> : (
          <div className="service-packages-layout">
            <aside className={`service-packages-filters ${mobileFiltersOpen ? "is-open" : ""}`} aria-label="Service package filters">
              <div className="service-packages-filter-heading"><h2>Filters</h2><button type="button" onClick={clearFilters}>Clear all</button></div>
              <div className="service-packages-filter-group">
                <h3>Price</h3>
                <div className="service-packages-price-labels"><span>₹0</span><span>{money(maxPrice)}</span></div>
                <input className="service-packages-range" type="range" min="0" max={Math.max(1,maxAvailablePrice)} step="50" value={Math.min(maxPrice,maxAvailablePrice)} onChange={event => setMaxPrice(Number(event.target.value))} aria-label="Maximum package price"/>
                <label className="service-packages-max-price">Maximum price<input type="number" min="0" max={maxAvailablePrice} value={maxPrice} onChange={event => setMaxPrice(Math.max(0,Math.min(maxAvailablePrice,Number(event.target.value)||0)))}/></label>
              </div>
              <div className="service-packages-filter-group">
                <h3>Session duration</h3>
                {durations.map(duration => <label className="service-packages-filter-option" key={duration}><input type="checkbox" checked={selectedDurations.includes(duration)} onChange={() => toggleDuration(duration)}/><span>{duration} minutes</span></label>)}
                {!durations.length && <p className="service-packages-filter-hint">Duration filters will appear when sessions are available.</p>}
              </div>
              <button type="button" className="service-packages-apply" onClick={() => setMobileFiltersOpen(false)}>Show {filteredPackages.length} sessions</button>
            </aside>

            <div className="service-packages-results">
              <div className="service-packages-results-heading"><div><h2>{categoryTitle}</h2><p>{filteredPackages.length} {filteredPackages.length === 1 ? "session" : "sessions"}</p></div>
                <label className="service-packages-sort"><span>Sort by</span><select value={sortBy} onChange={event => setSortBy(event.target.value)}><option value="featured">Featured</option><option value="priceLow">Price: Low to High</option><option value="priceHigh">Price: High to Low</option><option value="duration">Duration: Short to Long</option><option value="name">Name: A to Z</option></select></label>
              </div>

              {filteredPackages.length ? <div className="service-packages-grid">{filteredPackages.map(item => <article className="service-package-card" key={item.id}>
                <div className="service-package-card__image-wrap">{categoryImage ? <img src={categoryImage} alt={categoryTitle} loading="lazy"/> : <div className="service-package-card__image-placeholder">{categoryTitle}</div>}<span>{item.durationMinutes} MINUTES</span></div>
                <div className="service-package-card__content"><h3>{item.name}</h3><p>{item.description || `A ${item.durationMinutes}-minute ${categoryTitle.toLowerCase()} session.`}</p><div className="service-package-card__bottom"><strong>{money(item.price)}</strong><button type="button" disabled={busyId !== null} onClick={() => book(item)}>{busyId === item.id ? "Preparing…" : "Book & Pay"}</button></div></div>
              </article>)}</div> : <div className="service-packages-empty service-packages-no-results"><h3>No sessions found</h3><p>Try another search or clear some filters to see available sessions.</p><button type="button" onClick={clearFilters}>Clear filters</button></div>}
            </div>
          </div>
        )}
        <p className="service-packages-timezone">Appointments are scheduled through Calendly. Select your preferred time and timezone on the booking page.</p>
      </section>
    </main>
  );
};

export default ServicePackages;
