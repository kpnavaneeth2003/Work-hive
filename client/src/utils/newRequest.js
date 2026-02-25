import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://localhost:8800/api",
  withCredentials: true,
});

newRequest.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const token = user?.token;

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default newRequest;