import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../../api/axios";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("This reset link is invalid or missing its token.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/resetPassword", {
        token,
        newPassword: password,
      });
      setMessage(response.data.message || "Password reset successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password">
      <h2>Choose a New Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password (at least 8 characters)"
          minLength={8}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
      <Link to="/login">Back to Login</Link>
    </div>
  );
};

export default ResetPassword;