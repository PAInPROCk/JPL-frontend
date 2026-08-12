import axios from "axios";

const host = window.location.hostname;

export const api = axios.create({
  baseURL: `http://${host}:5000`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});