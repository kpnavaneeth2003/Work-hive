import React, { useEffect, useRef, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { currentUser, logout } = useContext(AuthContext); 

  const CATEGORIES = [
    "Plumbing",
    "Electrician",
    "Carpentry",
    "Landscaping",
    "Cleaning",
    "Bathroom renovators",
    "Builders",
    "Air conditioning services",
    "Arborist",
  ];

  const userMenuRef = useRef(null);

  useEffect(() => {
    const isActive = () => setActive(window.scrollY > 0);
    window.addEventListener("scroll", isActive);
    return () => window.removeEventListener("scroll", isActive);
  }, []);

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        if (!currentUser?._id) return;
        const res = await newRequest.get("/messages/unread/count");
        setUnreadCount(res.data?.count || 0);
      } catch (err) {}
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, [currentUser?._id]);

  const handleLogout = async () => {
    setOpen(false);
    await logout(); 
    navigate("/");
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">Workhive</span>
          </Link>
          <span className="dot">.</span>
        </div>

        <div className="links">
          {currentUser ? (
            <div
              className="user"
              ref={userMenuRef}
              onClick={() => setOpen((prev) => !prev)}
            >
              <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
              <span>{currentUser.username}</span>

              {open && (
                <div className="options" onClick={(e) => e.stopPropagation()}>
                  {currentUser.isSeller && (
                    <>
                      <Link className="link" to="/mygigs" onClick={() => setOpen(false)}>
                        Gigs
                      </Link>
                      <Link className="link" to="/add" onClick={() => setOpen(false)}>
                        Add New Gig
                      </Link>
                    </>
                  )}

                  <Link className="link" to="/orders" onClick={() => setOpen(false)}>
                    Services
                  </Link>

                  <Link
                    className="link msgLink"
                    to="/messages"
                    onClick={() => setOpen(false)}
                  >
                    <span>Messages</span>
                    {unreadCount > 0 && <span className="msgBadge">{unreadCount}</span>}
                  </Link>

                  <span
                    className="link"
                    onClick={handleLogout}
                    style={{ cursor: "pointer" }}
                  >
                    Logout
                  </span>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">
                Sign in
              </Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>

      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                className="link menuLink"
                to={`/gigs?cat=${encodeURIComponent(cat)}`}
              >
                {cat}
              </Link>
            ))}
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;