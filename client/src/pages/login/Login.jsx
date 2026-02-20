import React, { useState, useContext } from "react";
import "./Login.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ use context

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/login", { username, password });

      // ✅ use context login instead of localStorage directly
      login(res.data);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>

        <label>Username</label>
        <input
          name="username"
          type="text"
          placeholder="johndoe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>

        {error && <span className="error">{error}</span>}
      </form>
    </div>
  );
}

export default Login;
