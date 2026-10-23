import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { api } from "../../../api/axios";
import "../CSS/Login.css";

const Signup = ({ isModal = false, onClose,onLoginClick }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await api.post("/auth/signup", form);
      setMessage("Your account has been created. Please sign in.");

window.setTimeout(() => {
  if (isModal) {
    onLoginClick?.();
  } else {
    navigate("/login");
  }
}, 900);
    } catch (err) {
      setError(err.response?.data?.Error || err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <div className={isModal ? "login login-overlay" : "login"} onMouseDown={(e) => isModal && e.target === e.currentTarget && onClose?.()}>
      <div className="loginCard signup-card" role="dialog" aria-modal={isModal ? "true" : undefined}>
        {isModal && <button type="button" className="close-btn" onClick={onClose} aria-label="Close signup"><X size={22} /></button>}
        <h2>Create Your Account</h2>
        <p>Begin your journey with The Healing Star</p>
        <button type="button" className="google-login-btn" onClick={handleGoogleSignup}>Continue with Google</button>
        <div className="login-divider"><span>OR SIGN UP WITH EMAIL</span></div>
        <form onSubmit={handleSubmit} className="email-login-form">
          <label htmlFor="signup-name">Full Name</label>
          <input id="signup-name" name="name" placeholder="Enter your name" value={form.name} onChange={handleChange} autoComplete="name" required />
          <label htmlFor="signup-email">Email Address</label>
          <input id="signup-email" type="email" name="email" placeholder="Enter your email" value={form.email} onChange={handleChange} autoComplete="email" required />
          <label htmlFor="signup-password">Password</label>
          <input id="signup-password" type="password" name="password" placeholder="At least 8 characters" value={form.password} onChange={handleChange} autoComplete="new-password" minLength={8} required />
          {error && <p className="error-message" role="alert">{error}</p>}
          {message && <p className="signup-success" role="status">{message}</p>}
          <button type="submit" className="email-login-btn" disabled={loading}>{loading ? "Creating account..." : "Create Account"}</button>
        </form>
        <p className="login-note">Your details stay connected to your account.</p>
        {/* <p className="switch">Already have an account? <Link to="/login" onClick={isModal ? onClose : undefined}>Login</Link></p> */}
        <p className="switch">
  Already have an account?{" "}
  {isModal ? (
    <span
      role="button"
      tabIndex={0}
      onClick={onLoginClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onLoginClick?.();
        }
      }}
    >
      Login
    </span>
  ) : (
    <Link to="/login">Login</Link>
  )}
</p>
      </div>
    </div>
  );
};

export default Signup;
