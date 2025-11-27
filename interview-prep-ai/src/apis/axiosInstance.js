import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // Vite proxy must be configured
  withCredentials: false,
});

export default axiosInstance;
