import axios from "axios";

const instance = axios.create({
  baseURL:
    window.location.hostname === "localhost"
      ? "http://localhost:4444"
      : "https://my-blog-backend-qniv.onrender.com",
});

instance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("token");

  if (token) {
    // config.headers.Authorization = token;
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
