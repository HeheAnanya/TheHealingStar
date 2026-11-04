import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {UserRound, Package, ShoppingBag, LogOut,} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { api } from "../../../api/axios";
import "../CSS/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [address, setAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({ name: "", phone: "", address: "", city: "", state: "", pincode: "" });
  const [editingAddress, setEditingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressMessage, setAddressMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/auth/me")
      .then(async (response) => {
        setUser(response.data.user);
        try {
          const addressResponse = await api.get("/address");
          const savedAddress = addressResponse.data;
          setAddress(savedAddress);
          if (savedAddress) {
            setAddressForm({
              name: savedAddress.name || response.data.user.name || "",
              phone: savedAddress.phone || "",
              address: savedAddress.address || "",
              city: savedAddress.city || "",
              state: savedAddress.state || "",
              pincode: savedAddress.pincode || ""
            });
          } else {
            setAddressForm(prev => ({ ...prev, name: response.data.user.name || "" }));
            setEditingAddress(true);
          }
        } catch {
          setAddress(null);
          setEditingAddress(true);
        }
      })
      .catch(() => {
        setError("Please sign in to view your account.");
      });
  }, []);

  const saveAddress = async (event) => {
    event.preventDefault();
    setSavingAddress(true);
    setAddressMessage("");
    try {
      const response = await api.post("/address", addressForm);
      setAddress(response.data);
      setEditingAddress(false);
      setAddressMessage("Address saved. Checkout will use this same address.");
    } catch (err) {
      setAddressMessage(err.response?.data?.message || "Unable to save your address. Please try again.");
    } finally {
      setSavingAddress(false);
    }
  };

  const updateAddressField = (event) => {
    const { name, value } = event.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Continue to the home page if logout request fails.
    }

    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-changed"));

    navigate("/", { replace: true });
  };

  return (
    <div className="account-page">
      <Navbar />

      <main className="account-wrap">
        <header className="account-heading">
          <span>YOUR HEALING STAR ACCOUNT</span>
          <h1>My Account</h1>
          <p>
            Your details, orders and shopping journey in one place.
          </p>
        </header>

        {error ? (
          <section className="account-card account-message">
            <UserRound size={34} />

            <h2>Sign in to continue</h2>
            <p>{error}</p>

            <button onClick={() => navigate("/")}>
              Return home and sign in
            </button>
          </section>
        ) : !user ? (
          <p className="account-loading">
            Loading your account…
          </p>
        ) : (
          <>
            <section className="account-card account-welcome">
              <div className="account-avatar">
                <UserRound size={30} />
              </div>

              <div>
                <span>WELCOME BACK</span>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
              </div>

              <button
                className="account-logout"
                onClick={logout}
              >
                <LogOut size={16} />
                Sign out
              </button>
            </section>

            <div className="account-shortcuts">
              <button onClick={() => navigate("/order/my")}>
                <Package size={22} />

                <span>
                  <strong>My Orders</strong>
                  <small>Track your purchases</small>
                </span>
              </button>

              <button onClick={() => navigate("/cart")}>
                <ShoppingBag size={22} />

                <span>
                  <strong>My Cart</strong>
                  <small>Review saved items</small>
                </span>
              </button>
            </div>

            <section className="account-card account-address-card">
              <div className="account-address-heading">
                <div><h2>Delivery address</h2><p>This saved address is shared with checkout and future order invoices.</p></div>
                {address && !editingAddress && <button type="button" className="account-address-edit" onClick={() => setEditingAddress(true)}>Edit address</button>}
              </div>
              {address && !editingAddress ? (
                <div className="account-saved-address">
                  <strong>{address.name}</strong><span>{address.address}</span>
                  <span>{[address.city, address.state, address.pincode].filter(Boolean).join(", ")}</span>
                  <span>Phone: {address.phone}</span>
                </div>
              ) : (
                <form className="account-address-form" onSubmit={saveAddress}>
                  <label>Full name<input name="name" value={addressForm.name} onChange={updateAddressField} required /></label>
                  <label>Phone number<input name="phone" value={addressForm.phone} onChange={updateAddressField} inputMode="tel" required /></label>
                  <label className="account-address-full">Address<input name="address" value={addressForm.address} onChange={updateAddressField} placeholder="House no., street, area" required /></label>
                  <label>City<input name="city" value={addressForm.city} onChange={updateAddressField} required /></label>
                  <label>State<input name="state" value={addressForm.state} onChange={updateAddressField} required /></label>
                  <label>PIN code<input name="pincode" value={addressForm.pincode} onChange={updateAddressField} inputMode="numeric" pattern="[0-9]{6}" required /></label>
                  <div className="account-address-actions">
                    <button type="submit" disabled={savingAddress}>{savingAddress ? "Saving…" : "Save address"}</button>
                    {address && <button type="button" className="account-address-cancel" onClick={() => setEditingAddress(false)}>Cancel</button>}
                  </div>
                </form>
              )}
              {addressMessage && <p className="account-address-message" role="status">{addressMessage}</p>}
            </section>

            <section className="account-card">
              <h2>Personal details</h2>

              <div className="account-detail">
                <span>Full name</span>
                <strong>{user.name}</strong>
              </div>

              <div className="account-detail">
                <span>Email address</span>
                <strong>{user.email}</strong>
              </div>
              <div className="account-detail">
                <span>Member since</span>
                <strong>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "—"}
                </strong>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
