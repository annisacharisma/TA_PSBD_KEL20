import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Ganti dengan URL ngrok Anda
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Request URL:", `${config.baseURL || ""}${config.url}`);
    console.log("Token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["ngrok-skip-browser-warning"] = "true"; // Tambahkan header ini
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
