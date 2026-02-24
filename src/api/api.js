import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5024/api",
//   // baseURL: "https://leadgenerator-backend-production.up.railway.app/api",
//   timeout: 15001,
// });
const API = axios.create({
  baseURL: "http://api.iqsync.in/api",
  timeout: 15001,
});
// ---------------- REQUEST ----------------
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------- RESPONSE ----------------
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url || "";

      // 🔴 Logout ONLY when token is invalid (not during login or initial load)
      if (
        (status === 401 || status === 403) &&
        !url.includes("/auth/login")
      ) {
        console.warn("Auth error → logging out");
        localStorage.clear();
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default API;
