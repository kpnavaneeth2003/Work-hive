import { createContext, useEffect, useState } from "react";
import newRequest from "../utils/newRequest";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  // ✅ Refresh user from backend when userId changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!currentUser?._id) return;

        const res = await newRequest.get(`/users/${currentUser._id}`);
        setCurrentUser(res.data);
        localStorage.setItem("currentUser", JSON.stringify(res.data));
      } catch (err) {
        console.log("Failed to fetch user", err);

        // Optional: clear cookie too if something is wrong
        try {
          await newRequest.post("/auth/logout");
        } catch (e) {}

        setCurrentUser(null);
        localStorage.removeItem("currentUser");
      }
    };

    fetchUser();
  }, [currentUser?._id]);

  // ✅ Login (store user)
  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  // ✅ Logout (IMPORTANT: clear cookie on backend)
  const logout = async () => {
    try {
      await newRequest.post("/auth/logout"); // ✅ clears access_token cookie
    } catch (err) {
      console.log("Logout request failed", err);
    }

    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};