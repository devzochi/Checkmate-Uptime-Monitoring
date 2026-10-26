import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://checkmatemonitor.duckdns.org",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (accessToken) {
    // Axios 1.x may expose headers as AxiosHeaders; use its setter when available
    // so the bearer credential is reliably serialized on every service request.
    if (typeof config.headers?.set === "function") {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    } else {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

export default api;
