import axios from "axios";
import { getUser } from "./auth";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Request interceptor: attach role & token
api.interceptors.request.use(
  (config) => {
    const user = getUser();
    if (user) {
      // Attach role
      config.headers["X-User-Role"] = user.role;

      // Attach token if it exists
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
