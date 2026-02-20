import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}