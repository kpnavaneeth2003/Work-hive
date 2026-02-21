import React, { useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Register() {
  const [file, setFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // ✅ new

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSeller = (e) => {
    setUser((prev) => ({ ...prev, isSeller: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = file ? await upload(file) : "";

    try {
      await newRequest.post("/auth/register", {
        ...user,
        img: url,
      });
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>

          <label>Username</label>
          <input name="username" type="text" placeholder="Nizam" onChange={handleChange} />

          <label>Email</label>
          <input name="email" type="email" placeholder="email" onChange={handleChange} />

          <label>Password</label>

          {/* ✅ password with toggle */}
          <div className="passwordField">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
            />

            <span
              className="togglePassword"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <label>Profile Picture</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />

          <label>Country</label>
          <input name="country" type="text" placeholder="India" onChange={handleChange} />

          <button type="submit">Register</button>
        </div>

        <div className="right">
          <h1>I want to become a service provider</h1>

          <div className="toggle">
            <label>Activate the seller account</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>

          <label>Phone Number</label>
          <input name="phone" type="text" placeholder="+91" onChange={handleChange} />

          <label>Description</label>
          <textarea
            placeholder="A short description of yourself"
            name="desc"
            cols="30"
            rows="10"
            onChange={handleChange}
          />
        </div>
      </form>
    </div>
  );
}

export default Register;