// src/api/api.jsx
import axios from "axios";

const api = axios.create({
  baseURL: "https://kako-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Agregar token automáticamente si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
