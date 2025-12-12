import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5009/api",
// });
const API = axios.create({
  baseURL: "https://leadgenerator-backend-production.up.railway.app/api",
});

export default API;
