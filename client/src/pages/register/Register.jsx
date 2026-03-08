import React, { useMemo, useState } from "react";
import upload from "../../utils/upload";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

function Register() {
  const [file, setFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
    phone: "",
  });

  const navigate = useNavigate();

  const previewUrl = useMemo(() => {
    return file ? URL.createObjectURL(file) : "";
  }, [file]);

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSeller = (e) => {
    setUser((prev) => ({ ...prev, isSeller: e.target.checked }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!user.username || !user.email || !user.password || !user.country) {
    setError("Please fill in all required fields.");
    return;
  }

  try {
    setIsSubmitting(true);

    const url = file ? await upload(file) : "";

    await newRequest.post("/auth/register", { ...user, img: url });
    navigate("/login");
  } catch (err) {
    const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      "Registration failed. Please try again.";

    setError(typeof errorMessage === "string" ? errorMessage : "Something went wrong.");
    console.log(err);
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="register">
      <div className="registerContainer">
        <div className="registerHeader">
          <span className="badge">Join our platform</span>
          <h1>Create your account</h1>
          <p>
            Start exploring services, connect with clients, and grow your profile
            with a smooth onboarding experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="registerForm">
          <div className="formCard left">
            <div className="sectionTitle">
              <h2>Personal Information</h2>
              <p>Enter your basic account details.</p>
            </div>

            <div className="fieldGroup">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                onChange={handleChange}
              />
            </div>

            <div className="fieldGroup">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={handleChange}
              />
            </div>

            <div className="fieldGroup">
              <label htmlFor="password">Password</label>
              <div className="passwordField">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  onChange={handleChange}
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

            <div className="fieldGroup">
              <label htmlFor="profilePic">Profile Picture</label>
              <input
                id="profilePic"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {previewUrl && (
                <div className="imagePreview">
                  <img src={previewUrl} alt="Profile preview" />
                </div>
              )}
            </div>

            <div className="fieldGroup">
              <label htmlFor="country">Country</label>
              <input
                id="country"
                name="country"
                type="text"
                placeholder="Enter your country"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="formCard right">
            <div className="sectionTitle">
              <h2>Seller Profile</h2>
              <p>Enable this if you want to offer services on the platform.</p>
            </div>

            <div className="sellerBox">
              <div className="sellerText">
                <h3>Become a service provider</h3>
                <p>Activate a seller account to showcase your skills and attract clients.</p>
              </div>

              <label className="switch">
                <input type="checkbox" checked={user.isSeller} onChange={handleSeller} />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="fieldGroup">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="+91 9876543210"
                onChange={handleChange}
              />
            </div>

            <div className="fieldGroup">
              <label htmlFor="desc">Description</label>
              <textarea
                id="desc"
                name="desc"
                rows="7"
                placeholder="Write a short description about yourself, your skills, or the services you provide."
                onChange={handleChange}
              />
            </div>

            {error && <div className="errorMessage">{error}</div>}

            <button type="submit" className="submitBtn" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;