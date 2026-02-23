import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://localhost:8800/api",
  withCredentials: true,
});

newRequest.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  const token = user?.token; // change to user?.accessToken if that's your field

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default newRequest;