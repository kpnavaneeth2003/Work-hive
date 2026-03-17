import axios from "axios";

const newRequest = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

newRequest.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const token = user?.token;

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default newRequest;