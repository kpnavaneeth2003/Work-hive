import { createContext, useEffect, useState } from "react";
import newRequest from "../utils/newRequest";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  // Optionally, fetch current user from backend on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!currentUser) return;
        const res = await newRequest.get(`/users/${currentUser._id}`);
        setCurrentUser(res.data);
      } catch (err) {
        console.log("Failed to fetch user", err);
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, []);

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
