import React, { useState, useContext } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await newRequest.post("/auth/login", {
        username: username.trim(),
        password,
      });

      login(res.data);
      navigate("/");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Login failed. Please try again.";

      setError(typeof errorMessage === "string" ? errorMessage : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="loginContainer">
        <div className="loginHero">
          <h1>Sign in to your account</h1>
          <p>
            Access your dashboard, manage your profile, and continue where you left off.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="loginCard">
          <div className="cardHeader">
            <h2>Login</h2>
            <p>Enter your credentials to continue.</p>
          </div>

          <div className="fieldGroup">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="fieldGroup">
            <label htmlFor="password">Password</label>
            <div className="passwordField">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="togglePassword"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <div className="errorMessage">{error}</div>}

          <button type="submit" className="submitBtn" disabled={loading}>
            {loading ? "Logging in..." : "Sign In"}
          </button>

          <p className="footerText">
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;