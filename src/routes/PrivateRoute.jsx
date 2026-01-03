import { Navigate } from "react-router-dom";
import { isTokenValid } from "../utils/auth";

export default function PrivateRoute({ children, roles = [] }) {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toUpperCase();

  // No token → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Expired token → logout & go to login
  if (!isTokenValid(token)) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // Role-restricted route
  if (
    roles.length &&
    !roles.map(r => r.toUpperCase()).includes(role)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}
