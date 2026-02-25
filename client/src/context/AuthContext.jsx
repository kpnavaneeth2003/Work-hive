import React, { createContext, useEffect, useMemo, useState } from "react";
import newRequest from "../utils/newRequest";

export const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getStoredUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!currentUser?._id) return;

        const res = await newRequest.get(`/users/${currentUser._id}`);

        // ✅ merge instead of overwrite (prevents losing role/isSeller/etc.)
        setCurrentUser((prev) => {
          const merged = { ...(prev || {}), ...(res.data || {}) };
          localStorage.setItem("currentUser", JSON.stringify(merged));
          return merged;
        });
      } catch (err) {
        console.log("Failed to fetch user", err);
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
      }
    };

    fetchUser();
  }, [currentUser?._id]);

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const logout = async () => {
    try {
      await newRequest.post("/auth/logout");
    } catch (err) {
      console.log("Logout request failed", err);
    }
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const value = useMemo(() => ({ currentUser, login, logout }), [currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};