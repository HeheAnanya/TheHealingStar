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

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/auth/me")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        setError("Please sign in to view your account.");
      });
  }, []);

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
