import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { X } from "lucide-react";
import "../CSS/Login.css";
import { api } from "../../../api/axios";

const Login = ({ isModal = false, onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/login", { email, password });
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };
const handleGoogleLogin = () => {
  const backendUrl =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

  window.location.href = `${backendUrl}/auth/google`;
};

return (
  <div
    className={isModal ? "login login-overlay" : "login"}
    onMouseDown={(e) => {
      if (isModal && e.target === e.currentTarget) {
        onClose?.();
      }
    }}
  >
    <div
      className={isModal ? "loginCard login-modal" : "loginCard"}
      role="dialog"
      aria-modal={isModal ? "true" : undefined}
    >
      {isModal && (
        <button
          type="button"
          className="close-btn"
          onClick={onClose}
          aria-label="Close login"
        >
          <X size={22} />
        </button>
      )}

      <h2>Welcome Back</h2>
      <p>Sign in to your Healing Star account</p>

      <button
        type="button"
        className="google-login-btn"
        onClick={handleGoogleLogin}
      >
        Continue with Google
      </button>

      <div className="login-divider">
        <span>OR CONTINUE WITH EMAIL</span>
      </div>

      <form onSubmit={handleEmailLogin} className="email-login-form">
        <label htmlFor="login-email">Email Address</label>
        <input
          id="login-email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <div className="forgot-password-link">
          <Link to="/forgotPassword">Forgot Password?</Link>
        </div>

        {error && <p className="error-message" role="alert">{error}</p>}

        <button
          type="submit"
          className="email-login-btn"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login with Email"}
        </button>
      </form>

      <p className="login-note">
        Secure sign-in · Your account, your journey
      </p>

      {!isModal && (
        <p className="switch">
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      )}
    </div>
  </div>
);};

export default Login;
