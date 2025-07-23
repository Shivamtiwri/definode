// src/services/apiInstance.ts

import axios from "axios";

const apiInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://restapiv1.definode.io/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors if needed
if (typeof window !== "undefined") {
  apiInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token") || "";
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

export default apiInstance;
