
// // export default API;
// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5010/api",  // IMPORTANT FIX
// });

// // // const API = axios.create({
// // //   baseURL: "https://leadgenerator-backend-production.up.railway.app/api",
// // // });

// // Attach token automatically
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// src/api/api.js
// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5010/api",
// });

// // 🔐 Attach token to all requests
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default API;



import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5010/api",\
  baseURL: "https://leadgenerator-backend-production.up.railway.app/api",
});

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

export default API;
