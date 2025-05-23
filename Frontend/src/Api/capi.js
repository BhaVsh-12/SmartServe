import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;; // Adjust as needed

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" }
});

// Add token to requests if available
api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
