import React, { useEffect, useRef, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";
import { AuthContext } from "../../context/AuthContext";

const CATEGORIES = [
  "Plumbing",
  "Electrician",
  "Carpentry",
  "Landscaping",
  "Cleaning",
  "Bathroom renovators",
  "Air conditioning services",
  "Gardening",
  "Arborist",
];

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { currentUser, logout } = useContext(AuthContext);

  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        if (!currentUser?._id) {
          setUnreadCount(0);
          return;
        }

        const res = await newRequest.get("/messages/unread/count");
        setUnreadCount(res.data?.count || 0);
      } catch (err) {
        setUnreadCount(0);
      }
    };

    fetchUnread();

    if (!currentUser?._id) return;

    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, [currentUser?._id]);

  const handleLogout = async () => {
    try {
      setOpen(false);
      await logout();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const isActiveNavbar = active || pathname !== "/";

  return (
    <div className={isActiveNavbar ? "navbar active" : "navbar"}>
      <div className="container">
        <Link className="link logo" to="/">
          <span className="text">Workhive</span>
          <span className="dot">.</span>
        </Link>

        <div className="links">
          {!currentUser && (
            <>
              <span onClick={() => navigate("/gigs")}>Explore Services</span>
              <Link to="/login" className="link">
                Sign in
              </Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}

          {currentUser && (
            <>
              {!currentUser.isSeller && (
                <span onClick={() => navigate("/register?seller=true")}>
                  Become a Seller
                </span>
              )}

              <div
                className="user"
                ref={userMenuRef}
                onClick={() => setOpen((prev) => !prev)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpen((prev) => !prev);
                  }
                }}
              >
                <img src={currentUser.img || "/img/noavatar.jpg"} alt="User" />
                <span>{currentUser.username}</span>

                {open && (
                  <div className="options" onClick={(e) => e.stopPropagation()}>
                    {currentUser.isSeller && (
                      <>
                        <Link
                          className="link"
                          to="/mygigs"
                          onClick={() => setOpen(false)}
                        >
                          My Gigs
                        </Link>

                        <Link
                          className="link"
                          to="/add"
                          onClick={() => setOpen(false)}
                        >
                          Add New Gig
                        </Link>
                      </>
                    )}

                    <Link
                      className="link"
                      to="/orders"
                      onClick={() => setOpen(false)}
                    >
                      Services
                    </Link>

                    <Link
                      className="link msgLink"
                      to="/messages"
                      onClick={() => setOpen(false)}
                    >
                      <span>Messages</span>
                      {unreadCount > 0 && (
                        <span className="msgBadge">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
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
            </>
          )}
        </div>
      </div>

      {isActiveNavbar && (
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
        </>
      )}
    </div>
  );
}

export default Navbar;