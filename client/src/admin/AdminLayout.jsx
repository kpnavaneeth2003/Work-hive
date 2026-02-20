import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout, currentUser } = useContext(AuthContext);

  const [collapsed, setCollapsed] = useState(false);

  // ✅ remember collapsed state
  useEffect(() => {
    const saved = localStorage.getItem("adminSidebarCollapsed");
    if (saved === "1") setCollapsed(true);
  }, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("adminSidebarCollapsed", next ? "1" : "0");
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`adminLayout ${collapsed ? "isCollapsed" : ""}`}>
      <aside className="adminSidebar">
        <div className="adminBrand" onClick={() => navigate("/admin")}>
          <div className="adminLogo">🛠</div>
          <div className="adminBrandText">
            <div className="adminTitle">Admin Panel</div>
            <div className="adminSubtitle">Workhive</div>
          </div>
        </div>

        <nav className="adminNav">
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="navIcon">📊</span>
            <span className="navText">Dashboard</span>
          </NavLink>

          <NavLink to="/admin/users" className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="navIcon">👤</span>
            <span className="navText">Users</span>
          </NavLink>

          <NavLink to="/admin/gigs" className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="navIcon">🧰</span>
            <span className="navText">Gigs</span>
          </NavLink>

          <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? "active" : "")}>
            <span className="navIcon">🧾</span>
            <span className="navText">Services</span>
          </NavLink>
        </nav>
      </aside>

      <main className="adminMain">
        <header className="adminTopbar">
          <div className="adminTopbarLeft">
            <button className="adminToggleBtn" onClick={toggleSidebar} aria-label="Toggle sidebar">
              ☰
            </button>

            <div>
              <h2>Welcome, {currentUser?.username || "Admin"}</h2>
              <p>Manage users, gigs, and services</p>
            </div>
          </div>

          <button className="adminLogoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <section className="adminContent">
          <Outlet />
        </section>
      </main>
    </div>
  );
}