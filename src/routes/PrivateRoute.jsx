// src/routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

export default function PrivateRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    verify();
  }, []);

  async function verify() {
    const token = localStorage.getItem("token");
    if (!token) return setAuth(false);

    try {
      try {
        const res = await API.get("/auth/me");
        if (res.status === 200) setAuth(true);
        else throw new Error("Invalid token");
      } catch (err) {
        console.error("Auth check failed", err);
        localStorage.removeItem("token");
        setAuth(false);
      }
    } catch (err) {
      localStorage.removeItem("token");
      setAuth(false);
    }
  }

  if (auth === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-xl">
        Checking Authentication...
      </div>
    );
  }

  return auth ? children : <Navigate to="/login" replace />;
}
