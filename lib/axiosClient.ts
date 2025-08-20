import axios from "axios";

const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_BASE,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};
  config.headers["apikey"] = ANON;
  config.headers["Authorization"] = \Bearer \eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1ZWJ4Z2xoYmVudWxiY2Z0emRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NjQwMjcsImV4cCI6MjA3MDU0MDAyN30.j7GjRfvZbG6RwUPAYbFr1czTzPNISFPubOLK-Ciq2ZU\;
  return config;
});

export default api;