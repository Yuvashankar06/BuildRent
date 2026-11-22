import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.scss";

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = loginUser(email, password);

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Login successful!");

    if (result.user.role === "admin") {
      navigate("/admin/dashboard");
    } else if (result.user.role === "owner") {
      navigate("/owner/dashboard");
    } else {
      navigate("/my-rentals");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-container">
        <div className="auth-info">
          <span>BuildRent</span>

          <h1>Welcome back.</h1>

          <p>Login to manage your construction equipment rentals.</p>
        </div>

        <div className="auth-form-container">
          <h2>Login</h2>

          <p className="auth-subtitle">Enter your account details.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-btn">
              Login
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create Account</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
